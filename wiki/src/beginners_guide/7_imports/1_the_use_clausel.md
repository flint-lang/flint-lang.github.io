# The `use` clausel

The `use` clausel is a top-level definition, like a function definition for example, which provides a way to "import" code from other files (or modules). You have seen it quite a lot until now:

```rs
use Core.print
```

You have seen this line a lot of times and you have surely wondered what it means. But why do we call it a *clausel* and not a *statement*? In many other languages this inclusion of other code is known as the use-statement or include/import-statement, and they end with a semicolon. But, as you can see, the `use` clausel does not end with a semicolon in Flint, but why is that?

A *statement* is a line of code thats written within a *scope*. Many languages see the empty space in which we define our functions as their *top-level scope* or *file-level scope*. This means that global variables, imports, function definitions etc are all defined at this global scope. But Flint is a bit different in this regard. We do not call it a *use-statement* because in Flint **there is no global scope**. You cannot define a variable outside a function and use it inside multiple different functions. **There is no global state in Flint**, and that's a deliberate design choice. This also means that the use-clausel is *not* a statement, so it cannot be written inside the body of a function itself (unlike C or C++, for example).

## Example

But before moving on to any more complex topics, here is a small example of creating two files and compining them together:

This is the `main.ft` file:

```rs
use "utils.ft"
use Core.print

def main():
    i32 x = 5;
    i32 y = 6;
    i32 res = add(x, y);
    print($"res = {res}\n");
```

This is the `utils.ft` file:

```rs
def add(i32 x, i32 y) -> i32:
    return x + y;
```

And you compile the program with the same command as usual:

```rs
flintc -f main.ft
```

When running the built program, this line will be printed to the console:

> ```
> res = 11
> ```

As you can see, we have successfully called the function `add` defined in the file `utils.ft` from the `main` function inside the `main.ft` file, and the Flint compiler discovered the used file dynamically during compilation.
