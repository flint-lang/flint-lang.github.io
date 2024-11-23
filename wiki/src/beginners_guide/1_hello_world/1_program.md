# The Hello World Program

Lets create a simple `Hello World!` program! The entry point of every Flint program is the `main` function. It returns an integer exit code. This function is reserved for the programs entry point, so no other function is allowed to be called `main`.

To define a function, we introduce the `def` keyword. Like Python, Flint does not use curly braces (`{`, `}`) to determine what is inside a function, but hard tabs (`Tab`, `\t`)!

The end of every line has to be maked by writing a semicolon `;`.

With this out of the way, lets create a small simple Hello World program!

```rs
def main():
    print("Hello, World!");
```

The text between the `"` symbols is called a **string** (`str`) but this will be learned later, in the [next](#types) chapter! For now, all we have to know is, that `print` is a function, which outputs whatever string it recieves to the console. The output of the above program would look like

> Hello, World!
