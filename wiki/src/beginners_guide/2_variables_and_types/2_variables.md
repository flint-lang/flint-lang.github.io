# Variables

Let's talk about variables and what they really are. A _variable_ is an element of data that can be modified during the execution of a program, this can be an integer value, for example, or a string value. Variables are one of, if not even _the_ most important part of a program.

Every variable needs to have a fixed _type_ assigned to it. There are much more types than only the primitive types of the last chapter, but everything in this chapter will apply to other types as well. First, we need to define a variable. This is done like this:

```ft
def main():
    i32 x = 5;
```

You have already seen this in the last chapter, so lets unpack it now. `i32` is the type of the variable. `x` is the name (_identifier_) of the variable we just created, and we _declare_ the variable `x` to be the value of `5`. This whole line you see above is called a `declaration`, because we declare a new variable.
Now lets look at how to assign new values to the variable:

```ft
def main():
    i32 x = 5; // The declaration
    x = 7; // The assignment
```

We now store the value of `7` in the previously declared variable `x`. The variable `x` still has the type of `i32`. Types of variables cannot change after we declared a variable. This whole characteristic, that the type cannot change after the creation of a variable, and that the type of a variable is fixed, is called **static typing**.

## Shadowing

But what if we write something like this?

```ft
def main():
    i32 x = 7;
    i32 x = 8;
```

You can try to compile this program yourself and see what you get. But to make things a bit easier i show you. You will get this error:

> ```
> Parse Error at main.ft:3:9
> └─┬┤E0000│
> 1 │ def main():
> 3 │ »   i32 x = 8;
> ┌─┴─────────┘
> └─ Variable 'x' already exists
> ```

As you can see, Flint only allows one single variable with the identifier `x` to exist within the main function, even if its type differs:

```ft
def main():
    i32 x = 7;
    f32 x = 3.3;
```

This fails with the same error. Some languages support that a variable is "redefined" with another type, and from this new declaration onwards the variable has a different type. This is called _shadowing_, and Flint does not support this intentionally. Every variable can only exist once within a scope (we talk about scopes later on).

So, remember: The same identifier can only used once for variables!
