# Recursion

First of all, what even is recursion? Recursion is the act of calling a function from within itself forming a "chain" of calls. Lets start with the most simple example of a recursive function, calculating a fibonacci number:

```ft
use Core.print

def fib(i32 n) -> i32:
    if n <= 1:
        return n;
    else:
        return fib(n - 1) + fib(n - 2);

def main():
    for i := 0; i < 10; i++:
        i32 fib_i = fib(i);
        print($"fib({i}) = {fib_i}\n");
```

This program will print these lines to the console:

> ```
> fib(0) = 0
> fib(1) = 1
> fib(2) = 1
> fib(3) = 2
> fib(4) = 3
> fib(5) = 5
> fib(6) = 8
> fib(7) = 13
> fib(8) = 21
> fib(9) = 34
> ```

If you don't know what the fibonacci sequence is, you really should look into it, its beautiful. But, back to the recursive function, as there is a _lot_ to unpack here. The loop itself is **not** part of the recursive function, only the content of the `fib` function make it recursive, because the function calls itself through the calls `fib(n - 1)` and `fib(n - 2)`.

To understand the function you must first understand the fibonacci sequence itself. Basically, every number is the sum of the last two numbers that came before it with the exceptions of `1` and `0` as they are just the number itself. This exception is handled in the recursive function through the `if` branch. So, `fib(2)` is the sum of the last two numbers, `0` and `1`, so its result is `1` and so on and so forth.
