# The `use` clausel

The `use` clausel is a top-level definition, like a function definition for example, which provides a way to "import" code from other files (or modules). You have seen it quite a lot until now:

```ft
use Core.print
```

You have seen this line a lot of times and you have surely wondered what it means. But why do we call it a *clausel* and not a *statement*? In many other languages this inclusion of other code is known as the use-statement or include/import-statement, and they end with a semicolon. But, as you can see, the `use` clausel does not end with a semicolon in Flint, but why is that?

Whenever we define a function, a `data component`, enums or other **definitions**, we *define* something which can be re-used. A use-clausel, however, cannot be "reused" the same way. It describes a top-level construct which *describes* something but does not *define* anything. A different top-level clausel is the `type` alias clausel. It also does not *define* / *create* a new type, it just *describes* that a given type can be aliased through a different name too.

The file-level is called a **Namespace** in Flint instead. We will talk about namespaces soon, but for now just remember that every single file is considere to be it's own namespace.

## Example

But before moving on to any more complex topics, here is a small example of creating two files and compiling them together:

This is the `main.ft` file:

```ft
use Core.print

use "utils.ft"

def main():
    i32 x = 5;
    i32 y = 6;
    i32 res = add(x, y);
    print($"res = {res}\n");
```

This is the `utils.ft` file:

```ft
def add(i32 x, i32 y) -> i32:
    return x + y;
```

And you compile the program with the same command as usual:

```ft
flintc main.ft
```

When running the built program, this line will be printed to the console:

> ```
> res = 11
> ```

As you can see, we have successfully called the function `add` defined in the file `utils.ft` from the `main` function inside the `main.ft` file, and the Flint compiler discovered the used file dynamically during compilation.
