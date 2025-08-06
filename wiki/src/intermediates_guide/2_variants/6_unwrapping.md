# Unwrapping Variants

Okay now let's move on to variant unwrapping. In the last chapter you have learned how to check if a variant holds a given type and much more about comparing variants. But, in those if branches, when we *know* the variant holds the given type we actually want to get that value from the variant somehow. If you think back about optionals we had the `!` operator for forceful unwrapping and the `?` operator for optional chaining. For variants, this actually is quite similar. To unwrap a variant we use the `!(T)` syntax. In between the parenthesis we write which type we want to force-unwrap from the variant. Similar to how the force-unwrap operator `!` worked for optionals, this will print a small error message and crash the program if the variant does not hold the requested type.
Let's actually look at a modified version of one of the last chapter's examples:

```rs
use Core.print

variant MyVar:
	i32, f32, bool;

def main():
	MyVar var = 3.14;

	if var == i32:
		print($"holds i32 value: {var!(i32)}\n");
	else if var == f32:
		print($"holds f32 value: {var!{f32}\n");
	else if var == bool:
		print($"holds bool value: {var!{bool}\n");
```

This program will print this line to the console:

> ```
> holds f32 value: 3.14
> ```

It actually is semantically quite similar to the force-unwrap operator for optionals, and this is intended. Whenever you see the `!` symbol you should know that *"Okay the programmer asserted that this will always have a value (of that type)."*. This forms confidence over time. The more you see the same symbols used in the same context and same semantics the more you familiarize with them, just like how the `_` default expression works.

The above example is not really useful, though, as in this case the switch statement would be a much better fit. But the variant unwrapping operator is a very powerful tool for handling variants.

Also, we can of course provide a tag instead of the type `T` for variant unwrapping too, as always. So, if `i32` had a tag `Int` we must write `var!(MyVar.Int)` as usual, but that should be clear by now.
