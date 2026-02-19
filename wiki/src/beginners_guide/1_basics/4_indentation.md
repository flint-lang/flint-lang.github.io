# Indentation in Flint

Flint enforces **strict indentation rules** to ensure clean and readable code. Also, indentation is needed for _scoping_. Everything writen within the `main` functions is "inside" that function. If you don't indent instructions that are meant to be placed within the main function, for example, Flint will try to see if the line you wrote is a function or something else, like the `use Core.print` line.

Lets look at it in action:

```ft
use Core.print

def main():
print("This is not indented correctly.\n");
```

When you run the above code, you’ll see an error message:

> ```
> Parse Error at main.ft:3:11
> └─┬┤E0000│
> 3 │ def main():
> ┌─┴───────────┘
> └─ Expected a body after the :
> ```

This happens because Flint expects all code inside main to be indented. Here’s the correct way to write it:

```ft
use Core.print

def main():
	print("This is correctly indented.\n"); // Properly indented
```

Proper indentation is not just a stylistic choice in Flint – it’s a fundamental part of the syntax. You do not need to indent using hard tabs (`\t`), **4 spaces** are interpreted as tabs by the Flint compiler.
