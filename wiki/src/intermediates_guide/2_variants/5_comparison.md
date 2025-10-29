# Variant Comparison

We can compare variants with quite a few of different things. _Comparing_ means the equals and not-equals operations `==` and `!=`, nothing else. We cannot see if one variant is bigger than another variant, for example, but we can definitely see if they are equal to one another. We can also compare variants to types to see if they contain a value of that type. But, let's look at all different cases in isolation.

## Comparing Types

We can compare a variant to a type to do a quick "does it hold a value of that type" check:

```ft
use Core.print

variant MyVar:
	i32, f32, bool;

def main():
	MyVar var = f32(3.14);

	if var == i32:
		print("holds i32 value\n");
	else if var == f32:
		print("holds f32 value\n");
	else if var == bool:
		print("holds bool value\n");
```

This program will print this line to the console:

> ```
> holds f32 value
> ```

The `== T` check actually is semantically more of a _Does it hold a value of type `T`?_ check. If you look closely, you can see the similarity of the above code with a switch statement:

```ft
use Core.print

variant MyVar:
	i32, f32, bool;

def main():
	MyVar var = f32(3.14);

	switch var:
		i32(v):  print("holds i32 value\n");
		f32(v):  print("holds f32 value\n");
		bool(v): print("holds bool value\n");
```

with the same output as the other program. But in a switch we direclty gain an additional reference to the inner value of the variant we are working with. But, if we only want to do an action on only one type of the variant and do _nothing_ on all other types, we can't really express this through a switch statement. Because how do we define doing "nothing" in a switches branch? That simply isn't possible in Flint.

So, for that reason we can compare variants to types to see if it holds a value of that type. Note that `T` must be a valid type of the variant. If `T` is not a valid type of the variant, you will get a compile error stating that the type you try to compare the variant with is not a part of the variant's possible types.

## Comparing Tags

Just like we can compare a variant to it's type, we can compare a variant to it's tag to see if it holds a value of that type. As described in the chapter about tagged variants, a variation with a tag **must** be accessed and checked through the very same tag.

```ft
use Core.print

variant MyVar:
	Int(i32), Float(f32), bool;

def main():
	MyVar var = i32(-7);

	if var == MyVar.Int:
		print("holds Int value\n");
	else if var == MyVar.Float:
		print("holds Float value\n");
	else if var == bool:
		print("holds bool value\n");
```

This program will print this line to the console:

> ```
> holds Int value
> ```

Just like in the last example, the similarity to the switch statement is pretty easy to spot:

```ft
use Core.print

variant MyVar:
	Int(i32), Float(f32), bool;

def main():
	MyVar var = f32(3.14);

	switch var:
		MyVar.Int(v):   print("holds Int value\n");
		MyVar.Float(v): print("holds Float value\n");
		bool(v):        print("holds bool value\n");
```

which will have the same output once again. So, as you can see we can compare a variant value with one of it's possible tags in addition to comparing it with it's possible types. But, just like described in the chapter about tagged variants, we cannot do `var == i32`, even though `i32` is a valid type of the variant. We **must** check against it's tag when comparing and are not allowed to compare it to the underlying type directly if a tag is provided.

## Comparing Variants

Comparing two variants is pretty straight forward. Two variant's are considered to be equal if both their types as well as their values match up. You already know that the underlying structure of a variant is a `{ u8, byte[N] }`. Given this information you could quickly see that we cannot just compare the whole structure of a variant to another structure and if they are equal the variants are considered equal. It is a bit more nuanced than that. Let's say that we have the variant `variant<i32, f32, i64>`. In that case the variant has space for `8` bytes. So, if we have two variables and store `-1` and `1` as an `i64` in both of them all 8 bytes of the variant structure will be set. But if we then store the `i32` value of `7` in both of them, only the fist 4 bytes are overwritten and the last 4 bytes stay the same as they were before.
This means that comparing variants through their whole structure would not only compare what **is** stored in the variants but also what **was** stored in them, and this is semantically very incorrect. When we compare both variants and both hold an `i32` value and that `i32` value matches, they should be considered equal. Relying on the whole structure would actually be undefined behaviour, and we don't want that. So, that's why we only compare the first `N` bytes depending on the active type of the variant. That's more work internally, but it results in deterministic and defined behaviour.

So, here is a small example of comparing variants to one another:

```ft
use Core.print

variant MyVar:
	i32, i64, i32x3;

def main():
	MyVar var_1 = i64(-5);
	MyVar var_2 = i64(6);

	if var_1 == var_2:
		print("are equal\n");
	else:
		print("differ\n");

	var_1 = i32(5);
	var_2 = i32(5);
	if var_1 == var_2:
		print("are equal\n");
	else:
		print("differ\n");
```

This program will print these lines to the console:

> ```
> differ
> are equal
> ```

This output is expected. When we store different `i64` values in the variant they obviously do not match and then we store two equal `i32` values in the variant, so the variants should equal each other. If we would compare the whole structures of the variant to one another the second comparison of the two `i32` values would yield `false` which would be extremely counter-intuitive.

## The `active_type` field

Next we look at accessing the `active_type` field of the variant. You know the strucutre of the variant is `{ u8, byte[N] }` and the `active_type` field of a variant is the first field of that struct. We can access this value (readonly) by just doing `var.active_type` on an variant. This will return a `u8` value. And because we can compare `u8` values we can actually check whether two variant variables hold **the same type**. This is especially useful for situations where we just want to know whether two variants hold the same type, independent from _which_ type that is.

```ft
use Core.print

variant MyVar:
	i32, i64, i32x3;

def main():
	MyVar var_1 = i64(-5);
	MyVar var_2 = i64(6);

	if var_1.active_type == var_2.active_type:
		print("hold the same type\n");
	else:
		print("hold different types\n");

	var_1 = i32(5);
	if var_1.active_type == var_2.active_type:
		print("hold the same type\n");
	else:
		print("hold different types\n");
```

This program will print these lines to the console:

> ```
> hold the same type
> hold different types
> are equal
> ```

You will see in the next big chapter about [Error Sets](/intermediates_guide/3_error_sets.md) and you actually have seen it before for getting the [length of strings](/beginners_guide/6_arrays/3_strings.md#getting-a-strings-length) that you can access fields of primitive types or builtin types, fields which you normally do not see.

Note that the `active_type` indices start at `1`. This means that `i32` has the value `1`, `i64` the value `2` and `i32x3` the value `3`. Why the value `0` is not used here and why we have a one-based indexing in this case will be explained in a [later](/intermediates_guide/2_variants/8_optional_variants.md) chapter, stay tuned for that!

## Comparing Values

<div class="warning">

It is not yet entirely clear whether this feature will be implemented at all

While useful, this feature would make comparing variants ambiguous. When comparing a variant to a type or another variant of the same type it can be clearly seen what's actually happening. But in the example below, doing `var == ten` brings a bit of ambiguity with it, as now `ten` could be of type `MyVar`, `i32`, `i64` or `i32x3`. All types are entirely possible. For the parser this is no problem whatsoever, but for the person actually _reading_ the Flint code this leads to additional cognitive load, whereas when _not_ having this feature you can be sure that when you see `var == ten` that `ten` is definitely of type `MyVar` and can't be of any other type.
So, it is still thought about whether to actually implement this feature. It is not implemented for now, as it's just syntactic sugar and doing that comparison coould be done through other ways as well. We will reconsider adding this feature at a later point in time, when time has shown that we actually want and need it. But it is most likely for this feature to stay pretty uncommon.

</div>

Lastly, we can also compare variants to variables and literals of a given type directly. Just like we can do `var == i32` we can also do `var == 5` and this will do two checks for us: Is `var` of type `i32`? If yes, does it's value match the value we compare it to? It's the same as if we would write `var?(i32) != none and var!(i32) == 5` but we look at that syntax in the next chapter. Just be assured: It would be pretty hard to check if the variant matches a given value if this feature would not exist. This feature is something we would call syntactic sugar. It is not necessarily _required_ to be implemented, but it makes our lives quite a lot easier.

```ft
use Core.print

variant MyVar:
	i32, i64, i32x3;

def main():
	MyVar var = i64(-5);

	if var == i64(-5):
		print("equals i64(-5)\n");

	i32 ten = 10;
	var = i32(10);
	if var == i32(7):
		print("equals 7\n");
	else if var == ten:
		print("equals ten\n");
```

This program will print these lines to the console:

> ```
> equals i64(-5)
> equals ten
> ```

As you can see it makes our lives quite a lot easier.
