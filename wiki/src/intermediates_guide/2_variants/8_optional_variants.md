# Optional Variants

Lets finally talk about optional variants. As you know by now, the type tag of `0` has been reserved for optionals. Now we will cover why. So, an optional value is a struct like `{ bool has_value, T value }` so for example when we store a value with size and alignment of `8` (like a pointer) in it, we would have one single bit for the boolean `has_value` followed by full `63` bits of padding. So, what would happen if the value we store in it would be a variant whose largest possible type is said pointer with size `8` and alignment requirements of `8`? The structure then would look like this:

```
struct {
    bool has_value;
    struct {
        u8 active_type;
        u8[8] value;
    } value;
}
```

So, the `value` of the variant has a 8-byte alignment requirement which means the variant then would look like this in memory:

```
[1 bit 'has_value'] [63 bit padding] [8 bit 'active_type'] [56 bit padding] [64 bit 'value]
```

That's because the variant type itself, the struct, now has a 8-byte alignment requirement because one of its fields has an 8-byte alignment requirement. I think it is easy to see that this is really bad. We want to store a value which is atmost `8` bytes large and the optional variant would end up being `24` bytes in size. To store one bit and one byte we need `16` bytes storage (everything infront of the variant `value`).

This is the reason to why the type tag `0` was reserved. If the type tag is `0` it means "does not hold a value", e.g. the optional `none` case. And if the active type is `!= 0` then we hold a value. This means that an optional variant is **the same** structure as a "regular" variant, the optional is baked into it.

Lets now finally look at a small example:

```ft
use Core.print

variant MyVar:
	Int(i32), Float(f32), Bool(bool);

def main():
	MyVar var = MyVar.Float(3.14);
	MyVar? opt = var;

	print($"opt!.active_type = {i32(opt!.active_type)}\n");

	if opt! == MyVar.Int:
		print($"holds i32 value {opt!!(MyVar.Int)}\n");
	else if opt! == MyVar.Float:
		print($"holds f32 value {opt!!(MyVar.Float)}\n");
	else if opt! == MyVar.Bool:
		print($"holds bool value {opt!!(MyVar.Bool)}\n");
```

This program will print these lines to the console:

> ```
> opt!.active_type = 2
> holds f32 value 3.14
> ```

As you can see from the example, we defined an optional value `opt` which is of type `MyVar?`, so it's an optional variant. What you also can see is the optional unary unwrap postfix operator `!` directly followed by a variant unwrap `!(...)`. It may look a bit odd at first, but the expression `opt!!(MyVar.Int)` is the same as writing `(opt!)!(MyVar.Int)`, so we first unwrap the optional, whose result is a variant, and then we extract a certain value out of that resulting variant.
