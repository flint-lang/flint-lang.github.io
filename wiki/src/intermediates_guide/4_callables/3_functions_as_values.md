# Functions as Values

As discussed in the last chapter, functions can be stored on a callable variable, can be overwritten and called later. Another thing possible with callables is to pass them around, modify them within other functions, and call them in a context where the function itself never could "know" which function to call otherwise. Let's look at a small example showcasing callables being passed to functions:

```rs
use Core.print

def add(i32 x, i32 y) -> i32:
	return x + y;

def sub(i32 x, i32 y) -> i32:
	return x - y;

def mul(i32 x, i32 y) -> i32:
	return x * y;

def div(i32 x, i32 y) -> i32:
	return x / y;

def apply_op(fn<i32, i32 -> i32> op, i32 x, i32 y) -> i32:
	return op(x, y);

def main():
	fn<i32, i32 -> i32> op = ::add;
	i32 res = apply_op(op, 20, 10);
	print($"res = {res}\n");

	op = ::sub;
	res = apply_op(op, 20, 10);
	print($"res = {res}\n");

	op = ::mul;
	res = apply_op(op, 20, 10);
	print($"res = {res}\n");

	op = ::div;
	res = apply_op(op, 20, 10);
	print($"res = {res}\n");
```

This program will print these lines to the console:

> ```
> res = 30
> res = 10
> res = 200
> res = 2
> ```

As you can see, the function `apply_op` simply does not care which callable you pass into it as long as the signature matches up. The `apply_op` actls like a "work delegator" to apply operations given the parameters to call the function with. This example is a very simple one, in the later [Argument Bindings]() chapter there will be a similar example but with the operations in a *list* instead, where a list of operations is built up and then that list is executed, so stay tuned, there is some cool stuff ahead!

## Returning callables from functions

It's not just possible to pass callables to functions, we also can return them:

```rs
use Core.print

def add(i32 x, i32 y) -> i32:
	return x + y;

def sub(i32 x, i32 y) -> i32:
	return x - y;

def get_sub() -> fn<i32, i32 -> i32>:
	s := ::sub;
	return s;

def apply_op(fn<i32, i32 -> i32> op, i32 x, i32 y) -> i32:
	return op(x, y);

def main():
	fn<i32, i32 -> i32> op = ::add;
	i32 res = apply_op(op, 20, 10);
	print($"res = {res}\n");

	op = get_sub();
	res = apply_op(op, 20, 10);
	print($"res = {res}\n");
```

This example will print these lines to the console:

> ```
> res = 30
> res = 10
> ```

## Callables are passed by reference

Callables, like any complex data type in Flint, are always passed by reference, meaning that we can modify a passed-in callable:

```rs
use Core.print

def add(i32 x, i32 y) -> i32:
	return x + y;

def sub(i32 x, i32 y) -> i32:
	return x - y;

def set_sub(mut fn<i32, i32 -> i32> op):
	op = ::sub;

def apply_op(fn<i32, i32 -> i32> op, i32 x, i32 y) -> i32:
	return op(x, y);

def main():
	fn<i32, i32 -> i32> op = ::add;
	i32 res = apply_op(op, 20, 10);
	print($"res = {res}\n");

	set_sub(op);
	res = apply_op(op, 20, 10);
	print($"res = {res}\n");
```

This example will print these lines to the console:

> ```
> res = 30
> res = 10
> ```
