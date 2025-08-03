# Introduction

Flint's error system is quite unique. **Every** function can fail. Absolutely every single function a user defines in his code *can* fail. Because *every* function can fail, Flint can deeply integrate error handling into the language. A function returning a `str` value, for example, actually returns a `(err, str)` value. The first *implicit* return type of **any** Flint function is the error value of said function. This error value, however, is completely hidden from the user outside of Flint's error handling syntax.

Flint has two keywords for error handling: `throw` and `catch`. But, unlike Java or C++, where the error handling happens outside the normal execution path ("happy path" / "unhappy path") which completely breaks execution consistency and results in lots of context switching for the CPU, Flint has it's error handling system built directly into the calling / returning code of every function, which makes it much faster than traditional exception-based error handling.

Flint's error handling system, however, is based around the idea of `Error Sets`. An error set is basically just a type, a set type, consisting of every possible value the error could have. Here is a small example of that:

```rs
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

## Throwing errors

But here you can directly see how to define a new error set. We use the `error` keyword for that. And an error set looks pretty similar to an `enum` defiition, actually, but they are vastly different from one another. Let's look into how to throw an eror next.

```rs
use Core.print

error ErrorSet:
	Value1, Value2;

def fail():
	throw ErrorSet.Value1;

def main():
	fail();
	print("Normal execution continues\n");
```

This program will print this line to the console:

> ```
> ERROR: Program exited with exit code '-286738258'
> ```


<div class="warning">

This error message will change in the future, currently it just prints the type id

In the future the message should look more like `ERROR: Program exited due to thrown error: ErrorSet.Value1` but it will take more time and developement effort until this message can actually be printed.

</div>

## Catching errors

But what would an error be used for if we would not have a way to catch it? Here is how we catch errors in Flint:

```rs
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

The program now does no longer print the `ERROR: ...` message, as no error was thrown from the main function. This is a core concept of Flint: When an error is catched and it is handled it is consiered that the error is "no longer a problem" and execution will continue as if there was no error at all. But there is still a lot more to cover before we are able to completely understand what errors really are and how to effectively use them.
