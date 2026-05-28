# Linearization

Linearization essentially means the same for errors as it does for optional values ([Null Coalescing Operator](../1_optionals/4_null_coalescing.md)). In optionals you use the `??` operator as a binary operator to provide a "default-value" if the optional is `none`. For errors, we can do the exact same thing.

When calling a function which chan throw we can use the `catch` keyword **as a binary operator** and provide a default-value with the same type as the return-type of the function. If the function throws an error, it uses the default-value instead. Here is an example of this:

```ft
use Core.print

error MyError:
	VAL1, VAL2, VAL3;

def foo(bool crash) -> i32:
	if crash:
		throw MyError.VAL1("foo failed");
	return 42;

def bar(bool crash) -> i32 {MyError}:
	if crash:
		throw MyError.VAL2("bar failed");
	return 69;

def main():
	i32 x = foo(false);
	print($"x = {x}\n");
	x = foo(true) catch 20;
	print($"x = {x}\n");

	i32 y = bar(false);
	print($"y = {y}\n");
	y = foo(true) catch 20;
	print($"y = {y}\n");

	i32 z = foo(false) + bar(false);
	print($"z = {z}\n");
	z = foo(true) catch 10 + bar(true) catch 30;
	print($"z = {z}\n");
```

This program will print these lines to the console:

> ```
> x = 42
> x = 20
> y = 69
> y = 20
> z = 111
> z = 40
> ```
