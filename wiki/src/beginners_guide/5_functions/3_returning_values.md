# Returning Values

## Why Return Values?

Imagine you want a function to calculate the area of a rectangle. It’s not enough to just print the result—you may need to use the value elsewhere in your program. This is where returning values is essential.

## Basic Return Example

Declare a return type after the -> symbol in the function header:

```rs
def get_greeting() -> str:
    return "Hello, Flint!";
```

When the function is called, it **returns** the value to the caller:

```rs
def main():
    str greeting = get_geeting();
    print(greeting); // Outputs: Hello, Flint!
```

## Adding Arguments and Returning Values

Now let’s combine arguments with a return value:

```rs
def add_two_numbers(int a, int b) -> int:
    return a + b;
```

You can use the returned value in various ways:

```rs
def main():
    int result = add_two_numbers(10, 20);
    print($"The result is {result}."); // Outputs: The result is 30.
```

## What’s Next?
Returning a single value is great, but what if a function needs to return multiple pieces of data? Flint supports this, as we’ll see in the next section.
