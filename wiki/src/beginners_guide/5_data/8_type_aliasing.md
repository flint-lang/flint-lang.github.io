# Type Aliasing

A type alias is a pretty simple concept, honestly. It's exactly what it sounds like, aliasing one type to a new type name, here is a very simple example:

```ft
use Core.print

type SomeTuple data<i32, f32, u64>

def add(mut SomeTuple st):
	st.($0, $1, $2) += (4, 2.2, 7);

def main():
	SomeTuple st = (-10, 2.3, 2);
	add(st);
	print($"st.($0, $1, $2) = ({st.$0}, {st.$1}, {st.$2})\n");
```

This program will print this line to the console:

> ```
> st.($0, $1, $2) = (-6, 4.5, 9)
> ```

As you can see, whe have aliased the tuple type `data<i32, f32, u64>` to be usable with the alias `SomeTuple`. Type aliases, just like the `use` clausels, are part of the **clausels**, this means that they do not end with a semicolon (`;`).

You can also nest aliases or use them within data or other definitions. You can even alias primitive types if you would want to:

```ft
use Core.print

type Int i32
type Float f32

def main():
	Int i = -10;
	Float f = 3.5;
	print($"i: {i}, f: {f}\n");
```

This program will print this line to the console:

> ```
> i: -10, f: 3.5
> ```

While this is possible, it is generally not recommended to alias builtin types since it makes the code more unreadable. Use type aliasing with caution, as it has great potential to confuse other developers when looking at your code. But, in cases like the tuple type alias, aliasing can really improve the code's readability too.
