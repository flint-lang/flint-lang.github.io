# The Hello World Program

Lets create a simple `Hello World!` program which just prints the text `Hello, World!` to the CLI. But before we can do that we need to create an entry point for our Flint program.

The entry point of every Flint program is the `main` function. This function is reserved for the programs entry point, so no other function is allowed to be called `main`. The entry point of any program is the point where the program starts its execution. Any program works from top to bottom, and everything within the `main` function is executed first. You dont need to worry about `functions` yet, they are explained in a later chapter.

But, lets create the example first and then explain what actually happens afterwards:

```ft
use Core.print

def main():
    print("Hello, World!\n");
```

There is a lot to unpack here. You can safely ignore the `use Core.print` line for now. Just remember that this line needs to be written in order for the `print` function to be accessible. But what that line actually does will be described in a [later](wiki/src/beginners_guide/5_functions.md) chapter.

The `def main():` line is the definition of the main function, but functions are described in a [later](wiki/src/beginners_guide/5_functions.md) chapter too.

Now we come to the interesting line. `print("Hello, World!\n");`. `print` is a function call. A function call is like an instruction to execute. In this case we tell the Flint program to print the text to the console thats written in between the `"` symbols. This text between the `"` symbols is called a **string**. Here, we tell the `print` function to print the string `Hello, World!\n`. But what is this `\n` character? Its an escaped character for a new line. The `print` function does not print a new line after the string, so we need to provide a newline character manually.

The output of the above program would look like this:

> Hello, World!

Try to remove the `\n` character and see what it does for yourself!

Always remember: The best way to learn is to try new things. Your computer won't explode if you make mistakes in a program, so just try out a few things and see for yourself what works and what doesn't!
