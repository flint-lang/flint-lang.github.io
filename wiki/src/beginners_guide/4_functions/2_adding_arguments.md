# Adding Arguments

## What Are Arguments?

Arguments are variables passed to a function when it is called. They allow functions to operate on different data, making them far more versatile.

## Example: A Function with One Argument

```rs
def greet(str name):
    print($"Hello, {name}!");
```

When calling the function, provide a value for the argument:

```rs
def main():
    greet("Alice"); // Outputs: Hello, Alice!
    greet("Bob");   // Outputs: Hello, Bob!
```

## Multiple Arguments

Functions can take multiple arguments. Declare the arguments inside the parentheses, separated by commas:

```rs
def add_two_numbers(int a, int b):
    print($"The sum is {a + b}.");
```

Call the function by providing two values in the correct order:

```rs
def main():
    add_two_numbers(5, 7); // Outputs: The sum is 12.
```

## Important Notes:

1. The **type** of each argument matters. For example, if `a` and `b` are declared as `int`, you cannot pass `str` values.
2. The order of arguments also matters. Always pass values in the same order as declared in the function.

## What’s Next?
Arguments let you pass data into functions, but sometimes you want a function to give something back. That’s where return types come in.
