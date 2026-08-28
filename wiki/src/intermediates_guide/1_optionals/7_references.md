# Optionals as References

Optional values can be used as "lightweight pointers" of sorts. Normally, when we write an assignment like `Data d2 = d1;` the compiler will clone `d1` and store that cloned value in `d2`, meaning they point to entirely different memory. However, optionals do not work quite like this. When assigning the "real" complex data (complex data is a category of types, namely `data`, `object`) `Data? d2 = d1;` the value `d2` now points to the same memory as `d1` does. This works because all complex data types are stored in DIMA slots. You will learn why this is like it is [much much later](../../experts_guide/1_dima.md) when we actually talk about DIMA, but for now just remember that optional complex data types are references. Lets look at a small example to showcase this:

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

Thanks to DIMA, optionals can hold onto the data longer than the lifetime of the variable itself:

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

Because data is DIMA-managed, the reference-count of the allocated data increases by 1 when it is assigned to an optional value, meaning that the optional reference to that data is still valid, even if the original variable already went out-of-scope.
