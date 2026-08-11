# Introduction

In Flint, **every** function can fail. Absolutely every single function a user defines in the code *can* fail. Because *every* function can fail, Flint can deeply integrate error handling into the language. A function returning a `str` value, for example, actually returns a `(err, str)` value. The first *implicit* return type of **any** Flint function is the error value of said function. This error value, however, is completely hidden from the user outside of Flint's error handling syntax.

Flint has two keywords for error handling: `throw` and `catch`. But, unlike Java or C++, where the error handling happens outside the normal execution path ("happy path" / "unhappy path" = [Exceptions](https://en.wikipedia.org/wiki/Exception_handling)) which completely breaks execution consistency and results in lots of context switching for the CPU. Flint has its error handling system built directly into the calling / returning code of every function, which makes it much faster than traditional exception-based error handling.

Flint's error handling system, however, is based around the idea of `Error Sets`. An error set is basically just a type, a set type, consisting of every possible value the error could have. Here is a small example of that:

```ft
use Core.print

error ErrorSet:
	Value1, Value2;

def main():
	print("Hello, World!\n");
```

This program will just print this line to the console:

> ```
> Hello, World
> ```

But here you can directly see how to define a new error set. We use the `error` keyword for that. And an error set looks pretty similar to an `enum` defiition but they are vastly different from one another.

## Throwing errors

Lets look into how to throw an eror next:

```ft
use Core.print

error ErrorSet:
	Value1, Value2;

def fail():
	throw ErrorSet.Value1;

def main():
	fail();
	print("Normal execution continues\n");
```

This program will print these lines to the console:

> ```
> The given error bubbled up to the main function:
>  └─ ErrorSet.Value1: ""
> ```


<div class="warning">

Missing stack-traces

Flint currently has no support for printing stack-traces or anything like that. We plan on adding such a feature in the future, but it is not implemented yet. But since every error can contain its own context you can work around that problem by adding a context to thrown errors, as you will see later.

</div>

## Catching errors

But what would an error be used for if we would not have a way to catch it? Here is how we catch errors in Flint:

```ft
use Core.print

error ErrorSet:
	Value1, Value2;

def fail():
	throw ErrorSet.Value1;

def main():
	fail() catch err:
		print("Error catched!\n");
	print("Normal execution continues\n");
```

This program will print these lines to the console:

> ```
> Error catched!
> Normal execution continues
> ```

The program now does no longer print the main functions error message, as no error was thrown from the main function. This is a core concept of Flint: When an error is catched and it is handled it is consiered that the error is "no longer a problem" and execution will continue as if there was no error at all. But there is still a lot more to cover before we are able to completely understand what errors really are and how to effectively use them.
