# Error Sets

<div class="warning">

Everything regarding error handling **will** definitely change for later releases.

The current implementation of everything error-handling related is not final for Flint, and it will change quite a lot. This segment of the guide will be updated when the new system works and is in place. For the time being, the description of how it *currently* works in FLint is written here. So, expect substantial re-writes of this chapter for future releases.

</div>

Flint's error system is quite unique. **Every** function can fail. Absolutely every single function a user defines in his code *can* fail. Because *every* function can fail, Flint can deeply integrate error handling into the language. A function returning a `str` value, for example, actually returns a `(i32, str)` value. The first *implicit* return type of **any** Flint function is the error value of said function. This error value, however, is completely hidden from the user outside of Flint's error handling syntax.

Flint has two keywords for error handling: `throw` and `catch`. But, unlike Java or C++, where the error handling happens outside the normal execution path ("happy path" / "unhappy path") which completely breaks execution consistency and results in lots of context switching for the CPU, Flint has it's error handling system built directly into the calling / returning code of every function, which makes it much faster than traditional exception-based error handling.

## Throwing an error

Throwing an error is actually really simple. Here is a small examlpe:

```rs
use Core.print

def throw_if_bigger_than(i32 x, i32 y):
    if x > y:
        // We can only throw i32 values at the moment
        throw 69;

def main():
    throw_if_bigger_than(10, 5);
```

This program will print this line to the console:

> ```
> ERROR: Program exited with exit code '69'
> ```

You have already seen this `ERROR: ` message before, actually, at the `assert` core module. Even the `main` function returns an implicit `i32` error value. And if the main function returns an error value, the error value gets printed to the console like seen above. Because *every* function can throw an error, *every* function automatically propagates its returned error up the stack, if we dont handle the error. This is the reason why the call `throw_if_bigger_than` let the error bubble up to the main function.

## Catching an error

Catching an error is a bit more complicated.

```rs
use Core.print

def err_div(i32 x, i32 y) -> i32:
    if y == 0:
        throw 69;
    return x / y;

def main():
    i32 result = err_div(10, 0) catch err:
        print($"err = {err}\n");
    print($"result = {result}\n");
```

This program will print these linese to the console:

> ```
> err = 69
> result = 0
> ```

As you can see, if we `catch` an error explicitely, the first implicit return value of the function is stored inside the `err` variable. It is now up to us to handle the error. Because the error is just an `i32` value, the `err` variable is also of type `i32` here. We can just compare it to values, and for some values we can set the `result` value, or for another value we could manually re-throw the error with a `throw` statement.

Because there does not exist such thing as "uninitialized state" in Flint, the `result` variable is set to its default value in the case of an error. For the type `i32` this default value is `0`. For the `str` type the default value would be an empty string, a string of size 0, `""`.

We can also change the `result` variable within the catch block:

```rs
use Core.print

def err_div(i32 x, i32 y) -> i32:
    if y == 0:
        throw 69;
    return x / y;

def main():
    i32 result = err_div(10, 0) catch err:
        print($"err = {err}\n");
        result = 3;
    print($"result = {result}\n");
```

This program will print these lines to the console:

> ```
> err = 69
> result = 3
> ```

But that's basically it. That's all you need to know about Flint's current error handling features!

