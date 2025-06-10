# Adding Parameters

Parameters are "variables" of functions which you can change when calling the function, enabling the function to operate on different data, making them far more versatile and useful. Lets start with an example where we add a single parameter to a function:

```rs
use Core.print

def greet(str name):
    print($"Hello, {name}!\n");

def main():
    greet("Alice");
    greet("Bob");
```

Its a pretty simple example, but you can clearly see that we insert the paramter `name` into the string interpolation when calling the `print` function. So, the above example will print these lines to the console:

> ```
> Hello, Alice!
> Hello, Bob!
> ```

## Multiple Parameters

Functions can have multiple parameters. To declare multiple parameters, we separate them by commas, like this:

```rs
use Core.print

def add_two_numbers(i32 a, i32 b):
    print($"The sum is {a + b}.\n");

def main():
    add_two_numbers(5, 7);
```

This program will print this line to the console:

> ```
> The sum is 12.
> ```

## Important Notes:

1. The **type** of each argument matters. For example, if `a` and `b` are declared as `i32`, you cannot pass values of any other type, like `f32` or `u32`.
2. The order of arguments also matters. Always pass values in the same order as declared in the function.

There is an important difference between `parameters` and `arguments`, alltough this difference is only conceptual. When we define a function the "variables" that are defined, like `a` and `b` in our `add_two_numbers` function are called **parameters** of the function.

When we call a function and pass in values, like the values `5` and `7` for the call `add_two_numbers(5, 7)`, they are called **arguments** of the function call. This difference is important in later chapters, as they are not interchangably used by this wiki. So, if we talk about arguments we talk about _calls_ and if we talk about parameters we talk about function _definitions_.
