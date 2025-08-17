# Comparing Optionals

We now know how to access the value of an optional variable, but how do we check if the variable _actually_ holds a valid value at all? It's pretty simple, actually. **Any** optional value can bo compared with the `none` literal, so we can compare for equality / inequality extremely easily. Here is an example of that:

```ft
use Core.print

def main():
    i32? maybe = none;
    if maybe == none:
        print("has no value\n");

    maybe = 69;
    if maybe != none:
        print($"has value: {maybe!}\n");
```

This program prints these lines to the console:

> ```
> has no value
> has value: 69
> ```

But why can we compare any optional variable with `none` (including `none` itself)? Here is a small fun fact on how this is within the compiler: The `none` literal actually has the type `void?`, so its either _nothing_ or _nothing_, so it's really _nothing_ after all!

But we cannot only compare optional values to the `none` literal, but to other optional values too:

```ft
use Core.print

def main():
    i32? maybe_1 = none;
    i32? maybe_2 = none;
    if maybe_1 == maybe_2:
        print("are equal\n");

    maybe_1 = 69;
    if maybe_1 != maybe_2:
        print($"are inequal, maybe_1 = {maybe_1!}, maybe_2 = 'none'\n");

    maybe_2 = 420;
    if maybe_1 != maybe_2:
        print($"are inequal, maybe_1 = {maybe_1!}, maybe_2 = {maybe_2!}\n");

    maybe_2 = 69;
    if maybe_1 == maybe_2:
        print($"are equal, maybe_1 = {maybe_1!}, maybe_2 = {maybe_2!}\n");
```

This program will print these lines to the console:

> ```
> are equal
> are inequal, maybe_1 = 69, maybe_2 = 'none'
> are inequal, maybe_1 = 69, maybe_2 = 420
> are equal, maybe_1 = 69, maybe_2 = 69
> ```

So, you can see that two variables of type `i32?` match if either they are both `none` or their _actual_ values match. If one of them is `none` but the other one is not, they do not match, and same goes when both have a value but that value differs, then they also do not match. As you can see, we have used quite a bit of unwrapping (`!`) in this example and the program _would_ definitely crash if we would set both variables to `none` before the last `if` statement. So, you still need to use the unwrapping with caution.
