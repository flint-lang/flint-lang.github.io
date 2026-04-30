# The `fn` Type

Now that you have a basic understanding of the Thread Stack, we can talk about callables and the `fn` type. The `fn` type simply is the **type of a function**. Callables are essentially function instances, you can have a function variable which can be called, for example, and this variable needs a type.

## Signatures

First, the signatures of functions need to be covered before callables can be a topic. The `fn` type is just a simple **function type**. For example this function:

```rs
def greet():
    print("Hello, World!\n");
```

does not have any function parameters nor does it return any values. Not returning a value is the same as returning a `void` value. So, the signature of this function would be `fn<() -> void>`. The `()` denotes that the function does not have any parameters. This type, `fn<() -> void>`, already *is* the type of the `greet` function. The type of functions is always notated with the `fn` type.

Let's have a look at a more "complex" function, for example the `add` function:

```rs
def add(i32 x, i32 y) -> i32:
    return x + y;
```

The type of that function itself is `fn<i32, i32 -> i32>`. As you can clearly see, everything to the left of the `->` marks parameter types while everything to the right of the `->` marks return types. The `fn` type syntax directly follows a syntax which is very similar to the one when functions are defined. Note that a function returning multiple values returns a group, but when you define a function like this:

```rs
def div(i32 x, i32 y) -> (i32, i32):
	return (x / y, x % y);
```

then it's type is not `fn<i32, i32 -> (i32, i32)>` but it's `fn<i32, i32 -> i32, i32>` instead. So, when defining a `fn` type of a function returning multiple values, the parenthesis must be left out.

### Special cases

There exist two special-cases for the function signature notation in Flint when you manually define a `fn` type:

- If the function does not return anything
- If the function does not return anything nor does it have any parameters

If the function does not return anything, then the `-> void` can simply be left out. For example, a function like

```rs
use Core.print

def print_value(i32 value):
	print($"value = {value}\n");

def main():
	fn<i32> p = ::print_value;
	p(10);
```

has the signature of `fn<i32 -> void>` but the `fn` type can be notated as simply `fn<i32>`. It is quite common of functions to only have parameters and not return anything, this is the reason to why this more ergonomic notation exists. The above example will simply print `value = 10` to the console.

The second special case is when the referenced function neither has any return values nor does it have any parameters, in that case both the parameters and the return types can be omitted, so instead of writing `fn<() -> void>` we can write `fn<>` as well, this case is completely unambiguous:

```rs
use Core.print

def greet():
	print("Hello, World!\n");

def main():
	fn<> g = ::greet;
	g();
```

This example will just print `Hello, World!` to the console. As you noticed, there is no special-case for the case when a function has no parameters but returns something. The reason why there is no special-case, or "sugar" for that case is that *it's very uncommon and not really smart either*. Flint does not have any global state, so having a `fn<() -> i32>` function does not really make any sense, as this function would ultimately *always* return a constant, so why does the function then exist at all?

## Function references

Function referencing is the act of creating a function instance which can be stored in variables. It will become more clear once you saw a few examples. Let's start with the most simple example of the same `greet` function as above:

```rs
use Core.print

def greet():
    print("Hello, World!\n");

def main():
    fn<() -> void> g = ::greet;
    g();
```

This program will print this line to the console:

> ```
> Hello, World!
> ```

The **function reference operator `::`** can be seen in this example for the first time. Why Flint needs a separate operator for this will be discussed later when argument binding is explained. The function reference `::greet` is the most simple form of a function reference. If to the left of the `::` nothing is written, then it means that the function referencing operator searches for functions with the name of `greet` within the file's namespace. You could, in theory, also reference the `print` function, but this is not possible in Flint.

In the last chapter the basic theory of the Thread Stack has been taught. This theory is needed now. Every single user-defined function is managed via the Thread Stack, meaning that the local state of any user-created and called function is stored in the TS structure. `Core` functions, however, are not implemented in Flint itself. They are low level functions which do not use the Thread Stack at all, and any call to a Core module's function will still result in a regular hardware-stack based call. Because functions of Core modules are not managed by the TS, they also cannot be referenced. The same applies to `extern` functions as well, they too can not be referenced using the function reference operator `::`. If you try to reference the `print` function through an expression like `::print` you would get an error like this:

> ```
> Parse Error at main.ft:9:10
> └─┬┤E0000│
> 6 │ def main():
> 9 │ »   p := ::print;
> ┌─┴──────────┘
> ├─ Referencing Core module function 'print'
> └─ Referencing functions of Core modules is not allowed
> ```

In this example the line `p := ::print;` was added directly after the `g();` line from the above example.

## Callables

You have already seen a **Callable** before. Whenever we store a function on a variable, this variable is now named a **callable**, because it's a *callable variable*. So, we have been using callable throughout this chapter already.

It is very important to understand the Thread Stack in order to be able to understand callables. If we have a variable like `fn<() -> void> g = ...` then we need to know the type and the structure of that type in memory. In the last chapter the structure of the function frame has been discussed, and this knowledge is needed now. As per the rules of the last chapter, the function frame of the `greet` function looks like this:

```c
struct function_frame_t__greet {
    function_t base;
};
```

No arguments, no return values, no local variables. A function as small as it gets. If now a function reference is done, like `::greet`, then the function reference operator will allocate the above function frame type on the heap using `malloc` under the hood. But the variable `g` can have *any* function stored on it which has the signature of `fn<() -> void>`:

```rs
use Core.print

def greet():
	print("Hello, World!\n");

def greet2():
	i32 local = 10;
	print($"Hello from second greeting! local = {local}\n");

def main():
	fn<() -> void> g = ::greet;
	g();

	g = ::greet2;
	g();
```

This example will print these lines to the console:

> ```
> Hello, World!
> Hello from second greeting! local = 10
> ```

While both functions have identical signatures, their actual frame sizes differ because `greet2` has a local variable that `greet` does not. The function frame of the `greet2` function looks like this:

```c
struct function_frame_t__greet2 {
    function_t base;
    int32_t local;
};
```

And, it's a completely different function all together. So, **how does the callable know which function to call**? The solution to this is very simple, actually. Instead of allocating just enough space for the `function_frame_t__XXX` the function reference allocates 8 bytes more and stores the pointer to the function to call at the first 8 bytes:

```c
struct callable_frame_t__greet2 {
    void *fn_ptr;
    function_frame_t__greet2 frame;
};
```

Note that this above C code is only equal conceptually, Flint does not create any internal types for that callable frame type. By storing the pointer to the function to call directly in front of the frame which is passed to that called function, callables become very easy to implement. Remember: every single function in Flint has the same signature under the hood, being `i1 fn_name(ptr stack)`. So, when calling a callable we essentially do nothing than calling the stored fn pointer and passing the frame to it, like `g.fn_ptr(g.frame)`. This is a very lean abstraction on top of the Thread Stack.

### Callable Cleanup

When a callable goes out of scope or is overwritten, for example with a new function reference, like in the above example `g = ::greet2;`, then the original value of the callable `g` is freed. There does not happen a relocation. Note that it also is not possible for two callables to point to the same memory at the same time either, so when you assign one callable to another, like `g = g2;` for example then the allocated function frame of `g` is freed, and then the frame of `g2` is cloned into `g`.
