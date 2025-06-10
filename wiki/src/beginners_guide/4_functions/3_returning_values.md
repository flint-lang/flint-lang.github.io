# Returning Values

Imagine you want a function to calculate the area of a rectangle. It’s not enough to just print the result – you may need to use the value elsewhere in your program. This is where returning values is essential to any program. Here is a small and easy example of a function which returns a value:

```rs
def get_greeting() -> str:
    return "Hello, Flint!\n";
```

As you can see, you need to declare a return type after the `->` symbol in the function header. Also, if you want to return a value from within the function you need to use the `return` keyword followed by the value you want to return.

So, here is the full example:

```rs
use Core.print

def get_greeting() -> str:
    return "Hello, Flint!\n"

def main():
    str greeting = get_geeting();
    print(greeting);
```

This program will print this line to the console:

> ```
> Hello, Flint!
> ```

## Adding Parameters and Returning Values

Now let’s combine function parameters with a return value:

```rs
use Core.print

def add_two_numbers(i32 a, i32 b) -> i32:
    return a + b;

def main():
    i32 result = add_two_numbers(10, 20);
    print($"The result is {result}\n");
```

This program will print this line to the console:

> ```
> The result is 30
> ```

Okay, now that you know how to pass in arguments to a function and return values from the function lets move to the next chapter, _recursion_.
