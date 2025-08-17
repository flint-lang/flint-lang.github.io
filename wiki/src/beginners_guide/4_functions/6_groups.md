# Groups

What are groups? Groups are a new concept of Flint which allow us to do operations on multiple variables at the same time. You will see the potential and the integration of groups into other systems of Flint in later chapters, but even now groups are very powerful.

You have already seen groups in action when returning multiple values from a function, but that was just the beginning. Lets kick things off with a very simple example: variable swaps.

Lets define a simple small program which prints the values of two `i32` variables:

```ft
use Core.print

def main():
    i32 x = 1;
    i32 y = 5;
    print($"x = {x}, y = {y}\n");
```

This program will print this line to the console:

> ```
> x = 1, y = 5
> ```

Okay, now lets say that we want to swap the values of `x` and `y`. With most languages, better said with almost every language, you would need to create a temporary value to swap values:

```ft
use Core.print

def main():
    i32 x = 1;
    i32 y = 5;
    print($"x = {x}, y = {y}\n");

    i32 temp = x;
    x = y;
    y = temp;
    print($"x = {x}, y = {y}\n");
```

This program will print these lines to the console:

> ```
> x = 1, y = 5
> x = 5, y = 1
> ```

The temp variable exists because once we store the value of `y` into `x`, everything that was stored in `x` before is lost, so we need a way to keep track of the old value of `x` to be able to store it in `y`.

Okay, but now do groups help us with that? Have a look at the same example, but this time utilizing groups:

```ft
use Core.print

def main():
    i32 x = 1;
    i32 y = 5;
    print($"x = {x}, y = {y}\n");

    (x, y) = (y, x);
    print($"x = {x}, y = {y}\n");
```

This program will print these lines to the console:

> ```
> x = 1, y = 5
> x = 5, y = 1
> ```

Okay, lets unpack what this group even says. We know that the right hand side of any assignment is always executed before assigning the value. So, we create a group and load the values of `y` and `x` into it. Note that a group does not create any temporary values or "store" the values anywhere. When we load `y` and `x` in the group `(y, x)` these values exist only in the cache of the CPU, they are not really stored annywhere else.

So then, when we assign `(y, x)` which holds the values `(5, 1)` to the group of `(x, y)` this is called a **grouped assignment** as we assign multiple values of multiple variables at the same time. So, we store the values of `(5, 1)` on the group `(x, y)` which means that we store `5` in `x` and `1` in `y`, swapping the values of the variables.

It is very important to note that groups have **no** runtime footprint, they exist in order for us to be able to "tell" the compiler that we want stuff to happen at the same time. But groups are not limited to only 2 values, we can have as many values in a group as we would like. Here an example:

```ft
use Core.print

def main():
    i32 a = 1;
    i32 b = 2;
    i32 c = 3;
    i32 d = 4;
    print($"a = {a}, b = {b}, c = {c}, d = {d}\n");

    (a, b, c, d) = (c, d, a, b);
    print($"a = {a}, b = {b}, c = {c}, d = {d}\n");
```

This program will print these lines to the console:

> ```
> a = 1, b = 2, c = 3, d = 4
> a = 3, b = 4, c = 1, d = 2
> ```

So, we assigned `c` to `a`, `d` to `b`, `a` to `c` and `b` to `d`. Try around a bit, you can also assign all values to `a` in the same group:

```ft
use Core.print

def main():
    i32 a = 1;
    i32 b = 2;
    i32 c = 3;
    i32 d = 4;
    print($"a = {a}, b = {b}, c = {c}, d = {d}\n");

    (a, b, c, d) = (a, a, a, a);
    print($"a = {a}, b = {b}, c = {c}, d = {d}\n");
```

This program will print these lines to the console:

> ```
> a = 1, b = 2, c = 3, d = 4
> a = 1, b = 1, c = 1, d = 1
> ```

Funny thing is, you can also assign to the same variable twice inside a single group, because the order of operation is strictly defined. So, you can write this without a problem:

```ft
use Core.print

def main():
    i32 a = 3;
    print($"a = {a}\n");

    (a, a, a) = (a + 1, a + 2, a + 3);
    print($"a = {a}\n");
```

This program will print these lines to the console:

> ```
> a = 3
> a = 6
> ```

As you can see, this does not yield to an error...why? Because there is no reason why it should. The compiler should, however, print a warning describing the behaviour in this case. The right hand side of the grouped assignment is executed before any values are stored on the left, so first the group is evalueated to be `(4, 5, 6)` and then it is assigned to the group of `(a, a, a)`. Grouped assignments work from left to right, so we first assign `a` to be `4`, then to be `5` and finally to be `6`. The evaluation of a group is completely separate from the assignment of it, so this is a well-defined situation, and `a` will have its rightmost value from the group assigned to it.

But groups will become very important later on, and they will become more and more powerful regarding `data` and `SIMD`. If you know what this means, great. If not, don't worry, as all of these concepts will be explained in later chapters and `data` is actually the next chapter to follow!
