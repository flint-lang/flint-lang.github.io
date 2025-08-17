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

<div class="warning">

Because DIMA does not exist yet, be cautious with references.

DIMA will include ARC and will handle the case when the "owner" of the data (in our case `md`) goes out of scope but the optional does not. Because DIMA is not implemented yet, this code:

```ft
MyData? ref = none;
if true:
	MyData val = MyData(10, 3.14, "segfault");
	ref = val;
print($"ref.x = {ref!.x}\n");
```

will cause a segmentation fault of the program. You _need_ to be aware of this current limitation when using optionals.

</div>
