# Unwrapping

Unwrapping is the act of recieving / reading the value of an optional variable. When there is nothing stored in the optional, however, it is considered an error to access its value, as this could lead to wrong and potentially harmful behaviour (like undefined behaviour, nullpointers or many other things that could go wrong).

Because of this very reason Flint decides that accessing the value of an optional not holding a value is an error, and the program will crash with a simple message to the console stating that we tried to access the value of an empty optional. But enough talk, here is a small example showcasing exactly that:

```ft
use Core.print

def main():
    i32? maybe = 10;
    print($"maybe = {maybe!}\n");

    maybe = none;
    print($"mabye = {maybe!}\n");
    print("after access\n");
```

This program will print these lines to the console:

> ```
> maybe = 10
> Bad optional access occurred
> ```

As you can see, we use the `!` operator to **unwrap** an optional value. Currently, this does not `throw` an error (like `asssert` would, for example) but it hard-crashes the program instad. This is open for debate whether it should throw an error and be catchable instead (like an assertion error we then would have a bad optional access error). For now, hard-crashing is fine and works, because accessing an optional which has no value is considered a programmer error, not a user error. But how do we check if the variable has a value, to prevent this crash from happening? You will learn about this in the next chapter.

The crashing behaviour of force-unwrapping optional values can be changed using the `--optional <MODE>` flag of the compiler, you can look at the output of `flintc --optional --help` to learn more about the modes!
