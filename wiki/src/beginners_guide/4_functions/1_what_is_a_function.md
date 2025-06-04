# What is a Function?

## Introduction

A function is a reusable block of code designed to perform a specific task. Functions make programs easier to read, debug, and maintain by encapsulating logic into manageable pieces. Think of a function like a recipe—you can reuse it to "cook" something multiple times without rewriting the steps.

Here’s how you declare a simple function in Flint:

```rs
def say_hello():
    print("Hello, world!");
```

The function above doesn’t take any arguments or return anything. You define it using the def keyword, followed by the function name and parentheses ().

## Example: Calling a Function
Once a function is declared, you can "call" it to execute its logic:

```rs
def say_hello():
    print("Hello, world!");

def main():
    say_hello(); // Outputs: Hello, world!
```

## Why Use Functions?

Functions allow you to:
- Avoid repeating code.
- Organize logic into clear, reusable blocks.
- Make programs easier to read and debug.

## Hint for Next Chapter:
While useful, functions are limited without the ability to take arguments. Imagine a function that prints a personalized greeting—how could you tell the function what name to use? We’ll explore that next.
