# Discarding Return Values

You can use the default-operator `_` to discard return values of functions. It is best explained through a small example:

```ft
use Core.print

def get_strings() -> (str, str):
	return ("Hi", "there");

def print_and_add(i32 x, i32 y) -> i32:
	print($"adding {x} and {y}\n");
	return x + y;

def main():
	(_, y) := get_strings();
	print($"y is \"{y}\"\n");

	_ = print_and_add(30, 40);
```

This program will print these lines to the console:

> ```
> y is "there"
> adding 30 and 40
> ```

Flint does not yet enforce that unused function results need to be discarded explicitely, but it will be like that eventually.
