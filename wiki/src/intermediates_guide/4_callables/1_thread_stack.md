# The Thread Stack

Before we can look at *anything* related to callables we first need to go through the basics of the **Thread Stack**, what it is and how it works. The term "Thread Stack" only describes the combined machinery of Flints runtime. It is composed of well-known and industry-standard approaches, but how they are combined is what makes it special. We will first cover how the Thread Stack works and at the end of this page we will talk about what parts of it are industry-standard and what aspects are unusual. The Thread Stack is the beating heart of Flints runtime and enables many other Flint features, and makes them much easier to implement (in the compiler) and to reason about while programming.

## What is the Thread Stack?

First of all, the Thread Stack is not a replacement for the hardware-stack but an augmentation of it. If we talk about the stack in general, then we normally talk about the execution stack, so the place where all function-local state lives. When we call a function then new memory is *pushed* onto the stack and when a function returns it is *popped* from the stack. Almost every programming language is built around this central idea, to the point where even processors themselves are built around that very central idea of execution, to make it faster. If you want to know more about this, i would recommend starting at [Stack Machines](https://en.wikipedia.org/wiki/Stack_machine).

The Thread Stack is an abstraction on top of the hardware stack. The design of the Thread Stack originated from the core idea that every single thread would get its own stack-space, which is totally independent from the stack-space of other threads, hence the name. The design, however, evolved into a **much** more central piece of how many of Flint's features are implemented.

## Basics

As described above, the Thread Stack came from the idea that every single thread in a multi-threading context would have its own assigned stack-space on which it operates on. Flint does, with the exception of `shared data`, not have any global variables. It is quite impossible for two threads to share some state and modify it at the same time, but more on that topic when we reach multi-threading.

The structure representing a thread stack looks like this:

```c
struct thread_stack_t {
    // The remaining capacity of the Thread Stack before its "frame buffer" is full
    uint64_t capacity;

    // The pointer to the next free memory to put the next call frame at
    function_t *stack_ptr;

    // The ID of this thread
    uint32_t thread_id;

    // The flags (`ts_flags_e`)
    uint32_t flags;

    // The actual stack data of the thread stack (the frame buffer)
    char stack_data[];
};
```

The `capacity` starts at `2MiB = 2_097_152 Bytes` by default, so the `stack_data` has space for exactly `2MiB` of memory. This structure already **is** the Thread Stack itself. When a new TS is created, the above structure is created.

```c
enum ts_flags_e : uint32_t {
    // This Thread Stack is "free" and can be occupied by a `spawn` statement
    TS_FLAG_FREE = 0,

    // This Thread Stack is "available" and can be occupied by an `async`
    // expression or other parallel work from other threads while it is waiting
    // on a `sync` point
    TS_FLAG_AVAILABLE = 1,

    // This Thread Stack is currently used by a normal execution, for example
    // the main thread
    TS_FLAG_USED = 2,

    // This Thread Stack is currently operating on an callable function, this
    // is needed for persitent local support, and also to correctly load the
    // next TS frame
    TS_FLAG_CALLABLE = 3,

    // This Thread Stack is currently operating on an async function, we need
    // to keep track of this information to emit every following `async` call
    // as a direct call
    TS_FLAG_ASYNC = 4,
};
```

The TS flags are mutually exclusive, only one can be true at any point in time.

## Functions

Every single function in Flint is stored on the Thread Stack when it is called. This means that every function needs a type as well. The "base" type of every single function in Flint looks like this:

```c
struct function_t {
    // A pointer back to the thread stack itself to be able to tell which
    // thread a function is part of
    thread_stack_t *thread_stack;

    // The ID of the called (current) function
    uint64_t fn_id;

    // The error return value, since *every* user-defined and thus TS-managed
    // function can throw an error
    err_t err;
};
```

This is the basic function type of every single function in Flint, even a function with no return values, no local variables and no parameters will still have the above structure which takes up exactly `32 Bytes` of memory. So, Flint wastes a bit of memory per function, but half of that is the error return value already. This whole function structure (including the data like arguments, return values and local variables) is called a **Function Frame**. A function frame is the entire context of a single function call.

Lets look at a very small and simple example function and discuss how the resulting function frame looks like.

```ft
def add(i32 x, i32 y) -> i32:
    i32 result = x + y;
    return result;
```

The function frame of this function will look like this:

```c
struct function_frame_t__add {
    function_t base;
    int32_t ret0;
    int32_t x;
    int32_t y;
    int32_t result;
};
```

As you can see, Flint frames follow a very simple convention: First always comes the `base` function type containing all common data across *every* function in Flint. Then after that follow directly the return values. If more than one value is returned, more "fields" are added to the function frame type. After the return values come all parameters in their declared order and then, at the end, come all local variables in the order they are discovered from top to bottom inside the function.

So to stay at our example, the `add` function's structure has a size of `48` bytes. `32` bytes for the base function and another `16` bytes for all parameters, return value and local variable. You now are able to mentally create a function structure for every Flint function you have defined.

## Signatures

If you define a function like the `add` function from above, Flint will *not* generate a function like this:

```llvm
define i32 add(i32 %x, i32 %y) {
    ; ...
}
```

in LLVM. Instead, the above function will look like this when generated:

```llvm
define i1 add(ptr inreg %stack) {
    ; ...
}
```

or like this when generated using the `--optimize fast` flag of the Flint compiler:

```llvm
define tailcc i1 add(ptr inreg %stack) {
    ; ...
}
```

You do not need to understand the above LLVM IR code, but you should remember this: Every function in Flint has only one parameter which is the pointer to its function frame and every function only has a boolean (`i1`) return value indicating whether the function has failed (thrown an error). This is the signature of **every** Flint function, even the `main` function, and all `test "...":` "functions" too. This means that every Flint function follows one stable ABI across the entire codebase, no function differs. This unification of the function signature is one of the few specialities about the Thread Stack, but more on that later.

The only exception to this are, of course, `extern` functions, as those follow the C ABI instead.

## Calling Functions

When a function is called in Flint, the function frame of the called function is stored on the next free memory slot of the Thread Stack's memory and then the arguments are stored in the correct position within the function frame in the TS too. Then, when we call the function, the pointer to that free memory is simply passed to the function through an register (the `inreg` hint in the IR code).

Flint still emits `call` and `ret` instructions, so the hardware-stack is still in use in debug mode. When we compile a Flint program in release mode, it's getting interesting. In release mode, every function is defined as `tailcc` and every call becomes a `tail call`. Because of the stable ABI of every function, LLVM has a relatively easy time verifying the tail calling convention. The Flint compiler itself does not apply defunctionalization or CPS-transforms itself, we only provide a stable ABI and let LLVM do the rest for us.

This approach, of just slapping the `tailcc` and `tail call` on it, however only works on Linux at the moment. Windows seems to have stricter tail call requirements and as such the `--optimize fast` flag does not add the tail cc on Windows at this point in time.

## It's not unique

Lets summarize first before stating what is industry-standard and what is unique:

- The entire programs stack-state is stored in the Thread Stack structure, an abstraction on top of the hardware stack
- *Every* function passes its state through a register pointer which points to the stack frame
- *Every* function has the same underlying ABI
- *No* function has even one `alloca` instruction in its body, so all "stack data" is purely stored within the Thread Stack
- *Every* function is defined as `tailcc` and *every* call is marked as `tail call` ***on Linux***

The idea of abstracting a custom stack on top of the hardware-stack is not new, in fact it's an old hat already. This approach is mostly used in interpreted languages and is less common in compiled languages. There exists a base cost to this all: The Thread Stack is slower compared to the hardware-stack, so a function call in Flint is slower than a function call in C. However, the unification of calls in general, the stable ABI and the fact that every function just takes a pointer to its frame has a few implications for callables and later asynchronous compute (once that's implemented).

While Flint's execution model is uncommon in mainstream **compiled** languages, it shares conceptual similarities with several systems: Lua's register-based VM, stack-threaded interpreters like Forth, WebAssembly's explicit frame management, and [Continuation-Passing Style (CPS)](https://en.wikipedia.org/wiki/Continuation-passing_style) compilers. The closest architectural relative (as far as I know) is probably **Lua**, which also manages its own call stack independently of the hardware stack. However, Flint still is compiled and still uses LLVM to then optimize across function boundaries through the tail calling convention.


I am by no means an expert in the compiler internals of any other language than Flint. So, if you see any mistakes or false claims in this chapter, feel free to reach out to me! I want to keep everything here honest, the goal is not to "sell" Flint in any way but to describe Flints systems in the most honest way, and to make comparisons with existing systems of other languages honest.
