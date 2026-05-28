# Optionals as References

Flint does not have pointer or reference types, as you know. But optionals **are** implicitely this missing reference-type piece. For all complex data types, which are stored in DIMA slots, optionals become reference types to other data. You will learn why this is like it is much much later when we actually talk about DIMA, but for now just remember that optional complex data types are references. Let's look at a small example to showcase this:

```ft
use Core.print

data MyData:
	i32 x;
	f32 y;
	str v;
	MyData(x, y, v);

def main():
	MyData md = MyData(-5, 3.14, "Hello There");
	MyData? ref = md;

	ref!.(x, y) = (7, 6.28);

	print($"md.(x, y, v) = ({md.x}, {md.y}, \"{md.v}\")\n");
```

This example will print this line to the console:

> ```
> md.(x, y, v) = (7, 6.28, "Hello There")
> ```

As you can see, we do not modify `md` directly. We only modify the optional `ref`, but the optional `ref` internally is a reference to the data of `md`.

## Lifetime

Thanks to DIMA, optionals can hold onto the data longer than the lifetime of the data itself:

```ft
use Core.print

data MyData:
	i32 x;
	f32 y;
	str v;
	MyData(x, y, v);

def main():
	MyData? ref = none;
	if true:
		MyData val = MyData(10, 3.14, "segfault");
		ref = val;
	print($"ref.x = {ref!.x}\n");
```

This program will print this line to the console:

> ```
> ref.x = 10
> ```

Because data is DIMA-managed, the reference-count of the allocated data increases by 1 when it's assigned to an optional value, meaning that the optional reference to that data is still valid, even if the original data already went out-of-scope.
