# The Thread Stack

Before we can look at *anything* related to callables we first need to go through the basics of the **Thread Stack**, what it is and how it works. Flint has a relatively unique runtime approach which is very central to half of its more advanced features. Because this system is so central to it, it needs to be covered here as a pure theory-chapter. It's not that complicated after all, just take your time until you really understand it, as the knowledge of how the Thread Stack works is very important for understanding many other Flint features.

Only the basics of the Thread Stack are covered in this chapter, the masters guide contains a complete chapter on it.

## What is the Thread Stack?

First of all, we need to talk about what a stack in of itself is in programming. If we talk about the stack, then we normally talk about the execution stack, so the place where all function-local state lives. When we call a function then new memory is *pushed* onto the stack and when a function returns it is *popped* from the stack. Almost every programming language is built around this central idea, to the point where even processors themselves are built around that very central idea of execution, to make it faster. If you want to know more about this, i would recommend starting at [Stack Machines](https://en.wikipedia.org/wiki/Stack_machine).

Flint does not fully re-invent the wheel here, there have been years of research in this field and Flint does not state that the use of the hardware-stack is "wrong" by any means. It is, and stays, the faster method for implementing calls in programs. But for Flints goals and features it was a *much* better approach to go one level higher and essentially replace the hardware-stack with a custom stack solution. This solution is called the Thread Stack. The design of the Thread Stack originated from the core idea that every single thread would get its own stack-space, which is totally independent from the stack-space of other threads, hence the name. The design, however, evolved into a **much** more central piece of Flint, and now Flint would not be possible without it.

## Basics

As described above, the Thread Stack came from the idea that every single thread in a multi-threading context would have its own assigned stack-space on which it operates on. Flint does, with the exception of `shared data`, not have any global variables, ever. It is quite impossible for two threads to share some state and modify it at the same time, but more on that topic when we reach multi-threading.

The structure representing a thread stack looks like this:

```c
struct thread_stack_t {
    uint64_t capacity;
    function_t *stack_ptr;
    uint32_t thread_id;
    uint32_t flags;
    char stack_data[];
};
```

The Fields explained:
- **`capacity`**: The remaining capacity of the Thread Stack before its "frame buffer" is full
- **`stack_ptr`**: The pointer to the next free memory to put the next call frame at
- **`thread_id`**: The ID of this thread
- **`flags`**: The flags (ts_flags_e)
- **`stack_data`**: The actual stack data of the thread stack

```c
enum ts_flags_e : uint32_t {
    TS_FLAG_FREE = 0,
    TS_FLAG_AVAILABLE = 1,
    TS_FLAG_USED = 2,
    TS_FLAG_CALLABLE = 3,
    TS_FLAG_ASYNC = 4,
};
```

The flags explained:
- **`TS_FLAG_FREE`**: This Thread Stack is "free" and can be occupied by an `spawn` statement
- **`TS_FLAG_AVAILABLE`**: This Thread Stack is "available" and can be occupied by an `async` expression or other parallel work from other threads while it is waiting on a 'sync' point
- **`TS_FLAG_USED`**: This Thread Stack is currently used by a normal execution, for example the main thread
- **`TS_FLAG_CALLABLE`**: This Thread Stack is currently operating on an callable function, this is needed for persitent local support, and also to correctly load the next TS frame
- **`TS_FLAG_ASYNC`**: This Thread Stack is currently operating on an async function, we need to keep track of this information to emit every following `async` call as a direct call

The `capacity` starts at `2MiB = 2_097_152 Bytes` by default, so the `stack_data` has space for exactly `2MiB` of memory. This structure already **is** the Thread Stack itself. When a new TS is created, the above structure is created.

## Functions

Every single function in Flint is stored on the Thread Stack when it is called. This means that every function needs a type as well. The "base" type of every single function in Flint looks like this:

```c
struct function_t {
    thread_stack_t *thread_stack;
    uint64_t fn_id;
    err_t err;
};
```

The Fields explained:
- **`thread_stack`**: A pointer back to the thread stack itself to be able to tell which thread a function is part of
- **`fn_id`**: The ID of the called (current) function
- **`err`**: The error return value, since *every* user-defined and thus TS-managed function can throw an error

This is the basic function type of every single function in Flint, even a function with no return values, no local variables and no parameters will still have the above structure which takes up exactly 32 bytes of memory. So, Flint wastes a bit of memory per function, but half of that is the error return value already, but for that small wasted memory you get a lot of benefits, like callable support. This whole function structure (including the data like arguments, return values and local variables) is called a **Frame**. A function frame is the entire context of a single function call.

Lets look at a very small and simple example function and lets discuss how the resulting function frame looks like.

```rs
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

As you can see, Flint frames follow a very simple convention: First always comes the "base" function type containing all stuff that's common across *every* function in Flint. Then after that follow directly the return values. If more than one value is returned, more "fields" are added to the function frame type. After the return values come all parameters in their declared order and then, at the end, come all local variables in the order they are discovered from top to bottom inside the function.

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

You do not need to understand the above LLVM IR code, but you should remember this: Every function in Flint has only one parameter which is the pointer to its function frame and every function only has a boolean (`i1`) return value indicating whether the function has failed (thrown an error). This is the signature of **every** Flint function, even the `main` function, and all `test "...":` "functions" too. The only exception to this are, of course, `extern` functions.

This unification of the function signature is what made half of Flint's more advanced features even possible in the first place.

## Calling Functions

When a function is called in Flint, the function frame of the called function is stored on the next free memory slot of the Thread Stack's memory and then the arguments are stored in the correct position within the function frame in the TS too. Then, when we actually call the function, the pointer to that free memory is simply passed to the function through an register (the `inreg` hint in the IR code). Flint still does emit `call` and `ret` instructions, so the hardware-stack is still in use in debug mode. When we compile a Flint program in release mode, it's getting interesting. In release mode, every function is defined as `tailcc` and every call becomes a `tail call`.

There is no exact terminology what Flint enables through all these things, but lets summarize those things:

- *Every* function passes its state through a register pointer which points to the stack data
- *No* function has even one `alloca` instruction in its body, so *every* function is pure "instructions without state" (since the state is stored in the Thread Stack)
- *Every* function is defined as `tailcc` and *every* call is marked as `tail call`

This combination of things has some very cool effects:
1. The *entire* call chain becomes **ONE** giant function with direct `jmp` instructions emitted to jump between "function bodies", so the entire call graph can be provably converted into **direct control flow**
2. LLVM can optimize heavily across function boundaries because all functions are merged into one giant function
3. **[Unconditional tail call elimination](https://eklitzke.org/how-tail-call-optimization-works)** occurs naturally, every function call is proven safe to eliminate because all state is explicitly threaded through the `%stack` pointer, eliminating the need for any frame-based return addresses or local state preservation
4. The runtime becomes a single **[State Machine](https://en.wikipedia.org/wiki/Finite-state_machine)** where each function is merely a step in execution, advancing the computation by mutating the Thread Stack and jumping to the next step, rather than traditional function calls with return addresses
5. **Zero call overhead** in release mode. While TS management itself still takes a performance hit, the lack of `call` and `ret` instructions still manages to make the runtime fast, as it's just a sequence of unconditional jumps within a single flattened function body

These things all together mean that any Flint program (when compiled in release mode) becomes a single state machine which is really cool to think about. The original goal of the Thread Stack was merely to create a thread-local execution context but it has evolved into the beating heart of Flint's runtime.

While Flint's execution model is uncommon in mainstream compiled languages, it shares conceptual similarities with several systems: Lua's register-based VM, stack-threaded interpreters like Forth, WebAssembly's explicit frame management, and [Continuation-Passing Style (CPS)](https://en.wikipedia.org/wiki/Continuation-passing_style) compilers. The closest architectural relative is probably **Lua**, which also manages its own call stack independently of the hardware stack, enabling similar cross-function optimization opportunities. However, Flint's unique combination of compiled-to-native code, explicit register-based frame threading and unconditional tail-call flattening appears to be distinctive among production language runtimes.

As My knowledge in other language and compiler internals is very limited, I would be pleased if You could tell Me more about whether other languages, compilers or systems do it similarly to Flint.
