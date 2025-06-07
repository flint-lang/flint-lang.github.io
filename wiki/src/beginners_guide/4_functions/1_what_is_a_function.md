# What is a Function?

A function is a reusable block of code designed to perform a specific task. We have been working this entire time with a function, actually, the `main` function. No, actually we have worked with multiple functions, because we also have called the `print` function *a lot* throughout the last few chapters. Now is the time you are going to understand what a function really is and how to define your own ones!

Okay, lets start very simple first. We define a function with the `def` keyword (define). Following by the `def` keyword we put the name of the function and parenthesis `()`. Note that the names `main`, `_main` and all names starting with `__flint_` are disallowed by the compiler. Without these few exceptions, you can name your functions how you like.

```rs
use Core.print

def say_hello():
    print("Hello, World!\n");

def main():
    say_hello();
```

This program will print this line to the console:

> Hello, World!

There is a ***very*** important note to make here. The ordering of definition does not matter in Flint. So, you can define a function like `say_hello` *after* the `main` function and still be able to use it within the main function:

```rs
use Core.print

def main():
    say_hello();

def say_hello():
    print("Hello, World!\n");
```

This is an important part of how Flint works. The reasons to why this works like this are a bit more technical, but just note that ordering of definition does not matter in Flint, which will make your life a lot easier in the future, trust me.

While this function is cool, its not very useful yet because it will always only print the same message to the console. To make functions more useful we will need to add ways to pass data into and recieve data from functions. So, lets jump to the next chapter and discuss arguments.
