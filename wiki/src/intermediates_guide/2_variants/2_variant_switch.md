# Switching on Variants

In the last chapter we have looked at how to define variant types, but now we come to the fun part of variants, actually using them. You see, because a variant _can_ be one of our defined types we also need to check which one it actually _is_ before we can safely access the data that's stored within that variant. The easiest apporach to extract a variant's value is through a switch statement. Here is a small example of that:

```ft
use Core.print

variant MyVariant:
	i32, f32, u64;

def print_var(MyVariant var):
	switch var:
		i32(i): print($"holds i32 value of {i}\n");
		f32(f): print($"holds f32 value of {f}\n");
		u64(u): print($"holds u64 value of {u}\n");

def main():
	MyVariant var = -5;
	print_var(var);

	var = 3.4;
	print_var(var);

	var = u64(55);
	print_var(var);
```

This program will print these lines to the console:

> ```
> holds i32 value of -5
> holds f32 value of 3.4
> holds u64 value of 55
> ```

There is quite a lot to unpack here. First, we pass the variant to the function. Variants are considere complex data types in Flint, this means they are passed by **reference**, _not_ by **value**. This also means that changes to the variant within a function would result in these changes taking effect over at the callside of the function as well. You can see this behaviour in this example here:

```ft
use Core.print

variant MyVariant:
	i32, f32, u64;

def print_var(MyVariant var):
	switch var:
		i32(i): print($"holds i32 value of {i}\n");
		f32(f): print($"holds f32 value of {f}\n");
		u64(u): print($"holds u64 value of {u}\n");

def set_i32(mut MyVariant var, i32 value):
	var = value;

def set_f32(mut MyVariant var, f32 value):
	var = value;

def set_u64(mut MyVariant var, u64 value):
	var = value;

def main():
	MyVariant var = -5;
	set_i32(var, -10);
	print_var(var);

	set_f32(var, 3.4);
	print_var(var);

	set_u64(var, u64(55));
	print_var(var);
```

This program will print these lines to the console:

> ```
> holds i32 value of -10
> holds f32 value of 3.4
> holds u64 value of 55
> ```

But we need to discuss one more thing here and now: naming. You see that the accessor-variables of the variant have been named `i`, `f` and `u`. You actually do not need to give them separate accessing-names, because these "variables" will only be accessible within their respective switch branch:

```ft
use Core.print

variant MyVariant:
	i32, f32, u64;

def main():
	MyVariant var = -10;
	switch var:
		i32(v): print($"holds i32 value of {v}\n");
		f32(v): print($"holds f32 value of {v}\n");
		u64(v): print($"holds u64 value of {v}\n");
```

This program will print this line to the console:

> ```
> holds i32 value of -10
> ```

As you can see, you can name your value references however you like and their names will not collide. Again, just like with the value reference for optionals, you can mess up everything by setting the variant value you are switching on while you are still on one branch. This will be resolved eventually, but it also works at this point in time for variants:

```ft
use Core.print

variant MyVariant:
	bool8, u8, i32;

def main():
	bool8 b8 = 'A';
	MyVariant var = b8;
	switch var:
		bool8(v):
			print($"holds bool8 value of {v}\n");
			var = 47;
			print($"holds bool8 value of {v}\n");
		u8(v): print($"holds u8 value of {v}\n");
		i32(v): print($"holds i32 value of {v}\n");
```

This program will print these lines to the console:

> ```
> holds bool8 value of 01000001
> holds bool8 value of 00101111
> ```

This is actually a bit more dangerous than the same behaviour with optionals. In optionals, the value is just set to `0` through and thgough, leading to nullpointers etc. But here we could have a variant that can hold both an `u64` and a `str`, but the `str` is a pointer under the hood. This means that we can store a `u64` value in the variant inside the `str` branch and then we could point to _any_ memory address and possibly read strings from it. So, while this problem seemed to be only a small one for optionals, it's actually quite a large problem for variants, so this definitely needs to be fixed at some point.

I need to pre-empt this here, but currently through this we are also allowed to do some shenanigans, like native bitmasking for example. But for the following example i pre-empt tagged variants a bit, just bare with me for a second, you will understand what's going on down here by the next chapter!

```ft
use Core.print

variant BitMask:
	Bits(bool8, bool8, bool8, bool8), Value(u32);

def main():
	bool8 empty = '0';
	data<bool8, bool8, bool8, bool8> b8 = (empty, empty, empty, empty);
	BitMask var = b8;
	switch var:
		BitMask.Bits(b):
			print($"BitMask: {b.$0} {b.$1} {b.$2} {b.$3}\n");
			var = u32(1665025);
			print($"BitMask: {b.$0} {b.$1} {b.$2} {b.$3}\n");
		BitMask.Value(v): print($"holds u64 value of {v}\n");
```

This program prints these lines to the console:

> ```
> BitMask: 00110000 00110000 00110000 00110000
> BitMask: 00000001 01101000 00011001 00000000
> ```

And as you can see, the above mentioned problem can also be a feature. It's quite a lot more nuanced than just saying it's just bad, because now we can do bitmasking with it, without any temporaries, as the accessors are references to the same value. So, if the bitmask and the actual value have the same width, like in our case, both are `4` bytes in size, we can do pretty cool stuff with variants, as we can directly modify the memory in the `value` field and interpret it as a whole number or a mask where we can access each individual element.

So, whether this is a bug or a feature is open to debate, but in my opinion it could be a feature _if_ **none** of the possible types are complex and thus are pointers under the hood. If all values are _real_ values and not pointers under the hood i can't see why this should not be allowed for variants, as it's a pretty exploitable system for sure. And if no pointer can be stored in the variant, nothing can be accessed or written to at an arbitrary point in memory, which means the program will definitely not crash, it could only happen that you will get the wrong or unexpected values if you do exploit this. I think there should be a warning that mutating the variable inside the branch could lead to problems, but there should only be a compile-error if one of the variant's types is complex.

I cannot really think of a practical use case of this implication, honestly, especially since Flint will support shift operators `<<`, `>>` and bitwise operators like `|`, `&` and `!` as well in the future, so bitmasking for example is not really needed and useful when we have access to direct bit-manipulation as well.

And switch expressions work exactly the same way, just with a `->` instead of the `:` and with no scope but a single expression after the arrow, as usual. But now let's move on to the next chapter of tagging.
