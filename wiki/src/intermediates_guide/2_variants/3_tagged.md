# Tagged Variants

Until now we have learned how to declare variants and how to extract values of a certain type as well. But you may have noticed that all types we have used in the variant have been simple types like `i32`, `f32` etc. Let's look at a bit more complicated example then and it's implications on extracting the right type in a switch:

```ft
use Core.print

variant MyVariant:
	i32, f32, data<i32, f32, bool8>;

def print_var(MyVariant var):
	switch var:
		i32(i): print($"holds i32 value of {i}\n");
		f32(f): print($"holds f32 value of {f}\n");
		data<i32, f32, bool8>(t): print($"holds tuple value of ({t.$0}, {t.$1}, {t.$2})\n");

def main():
	MyVariant var = i32(-5);
	print_var(var);

	var = f32(3.4);
	print_var(var);

	// Flint currently has no way of using a group as the rhs of a variant assignment
	// when a tuple needs to be stored in the variant, but it will have it *eventually*
	data<i32, f32, bool8> tuple = (5, 6.9, bool8(u8(33)));
	var = tuple;
	print_var(var);
```

This program will print these lines to the console:

> ```
> holds i32 value of -5
> holds f32 value of 3.4
> holds tuple value of (5, 6.9, 00100001)
> ```

As you can see it is very very tedious to write the type `data<i32, f32, bool8` **every single time** you want to use a variation of that type. And we actually have a solution for that: _Tags_. A Tag is nothing else than a "name" you give to a variation of a variant. This name can be any identifier, actually. Here is the exact same program as above, but re-written using Tags:

```ft
use Core.print

variant MyVariant:
	Int(i32), Float(f32), Tuple(i32, f32, bool8);

def print_var(MyVariant var):
	switch var:
		MyVariant.Int(i): print($"holds i32 value of {i}\n");
		MyVariant.Float(f): print($"holds f32 value of {f}\n");
		MyVariant.Tuple(t): print($"holds tuple value of ({t.$0}, {t.$1}, {t.$2})\n");

def main():
	MyVariant var = MyVariant.Int(-5);
	print_var(var);

	var = MyVariant.Float(3.4);
	print_var(var);

	var = MyVariant.Tuple(5, 6.9, bool8(u8(33)));
	print_var(var);
```

This program will print these lines to the console:

> ```
> holds i32 value of -5
> holds f32 value of 3.4
> holds tuple value of (5, 6.9, 00100001)
> ```

You may notice that we have removed the `data< .. >` part of the tuple definition in the variant, but why? Well, because nothing else than tuples can hold multiple data at once and is anonymous as well. If we would have a `data` module defined somewhere, we would write the type of said module in between the parenthesis too. Parenthesis are not part of any type definition and this is the reason to why we can have the syntax `NAME(TYPE)` for variant tagging(Well, they actually are used to define `fn` typed variables which take no arguments, but you will learn about them later on). Comma-separated values in between the parenthesis define a tuple type as one possible variation of that variant.

When accessing / extracting the actual value of a tagged variant, we **need** to prefix the extraction with the type of the variant to signify we actually want to get a tag, not a type. Here is an example:

```ft
use Core.print

data Tuple:
	i32 x;
	f32 y;
	bool8 z;
	Tuple(x, y, z);

variant MyVariant:
	Tuple, Tuple(u64, f64), i32;

def main():
	MyVariant var = i32(10);
	switch var:
		Tuple(t): print($"Is Tuple: ({t.x}, {t.y}, {t.z})\n");
		MyVariant.Tuple(t): print($"Is MyVariant.Tuple: ({t.$0}, {t.$1})\n");
		i32(i): print($"Is i32: {i}\n");
```

This program will print this line to the console:

> ```
> Is i32: 10
> ```

There is, again, quite a lot to go through. First of all, the Type is absolutely needed for tagged accesses (`Type.Tag`) to be able to differentiate between a tagged access and an access of that type. This also prevents future collisions if you would, for example, later define a type with the same name as your variant tag. If we would not do this differentiation, you would then later on need to change your tag and change it everywhere you have used it or you would need to change your created type's name to something different to prevent collisions. Both would be a horrible experience. So, this is the reason to why it is **required** to explicitely state the type of the variant before the tag, if the variant's type is missing the "tag" is interpreted as a type and compilation will fail!

This decision might annoy you at first, but we hope that you will be able to see the reasons behind it and why it's so important to have this rule in place, as it also completely removes any ambuguity from the program itself.

## Empty Payloads

For tagged variants, it is also possible to declare the type of the variant as `void`, meaning that this variation does not hold any payload. This capability has some implications. First of all, you *always* need to write the type `void` when defining a tagged variant, like

```ft
variant MyVariant:
	Empty(void), Value(f32);
```

It is not allowed to just write `Empty` or `Empty()` here, you need to write the type `void` manually, that's intentional. When switching on a variant containing an empty payload tag you just need to write `MyVariant.Empty()`, e.g. not provide a capture variable like `f` in the case of `MyVariant.Value(f)`. And it's also the same for the variant constructors, instead of writing `MyVariant.Value(3.3)` you need to write `MyVariant.Empty()`. There is no reason why writing `MyVariant.Empty` is not allowed other than not having as much overlap between variants and enums, and we want to minimize syntactic overlap as much as possible.
