# Inline Variants

Variants can not only be defined explicitely but also, like `data`, inline too. For `data` this inline definition then is a `tuple`, but for varaints this inline-definition is, well, an inline-defined variant.

Here is a small example of just that:

```rs
use Core.print

def print_var(variant<i32, f32, str> var):
	switch var:
		i32(i): print($"i = {i}\n");
		f32(f): print($"f = {f}\n");
		str(s): print($"s = {s}\n");

def main():
	variant<i32, f32, str> var = -55;
	print_var(var);

	var = 3.14;
	print_var(var);
	
	var = str("Hello There");
	print_var(var);
```

This program will print these lines to the console:

> ```
> i = -55
> f = 3.14
> s = Hello There
> ```

There are a few differences of inline-defined variants and "properly" defined variants. Inline-defined variants **cannot** be tagged, because the varaint type itself does not even have a name, so tagging is impossible. This means that the type of an inline-variant needs to be specified when we want to unwrap the value a variant currently holds, which can be seen in the `print_var` function. But other than this fact, that tagging is impossible, inline-defined variants behave exactly the same as normally defined variants.

Inline-defined variants become useful when we do not want to pullute our global namespace with yet another symbol name for yet another variant type, for example when a field in custom-defined `data` can be either `i32` or `f32`:

<div class="warning">

The below example does not work yet because of several reasons

Firstly, it is not possible to switch on a non-variable expression at the moment. It will take some time until Flint is robust enough to support switching on more things when switching on optionals and varaints. This is due to the references, in our case `i` and `f` which at the moment only work properly with varaible expressions, so everything that isn't a variable in the switch statement will throw an compile error.
And secondly, some other things regarding how the variants are defined in data is horribly wrong too, which leads to all sorts of unexpected code generation output. So, it is best to avoid using variants within data for now.

</div>

```rs
use Core.print

data MyData:
	bool8 flags;
	variant<i32, f32> value;
	MyData(flags, value);

def main():
	variant<i32, f32> var = -10;
	MyData md = MyData(u8(0), var);
	print($"flags = {md.flags}\n");
	switch md.value:
		i32(i): print($"i = {i}\n");
		f32(f): print($"f = {f}\n");
```

This program will print these lines to the console:

> ```
> flags = 00000000
> i = -10
> ```
