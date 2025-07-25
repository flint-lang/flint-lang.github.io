# Optional Chaining

Optional chaining is quite interesting in Flint. You already have seen the `!` operator. You have been told until now that this operator is an *unary* operator, but that was not quite correct, actually. It's one of Flint's few "in-between operators" (There is no industry standard name for them, actually). One "in-between operator" is the dot `.`, actually. When you do a `var.field` the `.` is an operator itself. This operator has no clear name either, as it is used quite often in quite a lot of places. But, similar to how you can write the dot `.` "in-between" two identifiers to **form** an expression, the optional chaining operators `!` and `?` are used to **form** an expression too.


## Foce-Unwrapping Operator

Let's look at a very simple example with the unwrapping-operator, as you already know that one:

```rs
use Core.print

data Vec2:
	i32 x;
	i32 y,
	Vec2(x, y);

def main():
	Vec2 v2 = Vec2(10, 20);
	Vec2? v2m = v2;
	
	i32 x = v2m!.x;
	print($"x = {x}\n");
```

This program will print this line to the console:

> ```
> x = 10
> ```

As you can see, the optional force-unwrap operator `!` can not only be used as an unary operator (at the end of an expression) but as an "in-between operator" (i will call them *innies* from now on) as well. The above code showcases exactly what that operator does. It, again, force-unwraps the lhs and allows us to access it as if it was no optional. But, it will still hard-crash if there is no value stored in the unwrapped optional. We can also unwrap multiple fields of the vector at once:

```rs
use Core.print

data Vec2:
	i32 x;
	i32 y,
	Vec2(x, y);

def main():
	Vec2 v2 = Vec2(10, 20);
	Vec2? v2m = v2;
	
	(x, y) := v2m!.(x, y);
	print($"(x, y) = ({x}, {y})\n");
```

This program will print this line to the console:

> ```
> (x, y) = (10, 20)
> ```

And we can do array-accesses as well:

```rs
use Core.print

def main():
	i32[]? arr = i32[10](9);
	print($"arr[4] = {arr![4]}\n");
```

This program will print this line to the console:

> ```
> arr[4] = 9
> ```

In general, the optional force-unwrap operator can be used **exactly** the same way as if the variable would not be an optional at all. A normal array access would be `arr[4]`, optional it's `arr![4]`, so it's only the single operator added in between the "normal" operation on the variable.

## Optional Chaining Operator

The Optional Chaining Operator `?`, however, is quite a bit more complex to use and understand, but you will get the hang of it pretty quickly for sure. It is used *exactly* like the optional force-unwrapping operator `!` but it has a bit different semantics. When you force-unwrap an optional of type `T?` the result will be of type `T`. But, the optional chaining operator works a bit different. Here is an example:

```rs
use Core.print

data Vec2:
	i32 x;
	i32 y,
	Vec2(x, y);

def main():
	Vec2 v2 = Vec2(10, 20);
	Vec2? v2m = v2;
	
	i32? x = v2m?.x;
	if x == none:
		print("has no value!\n");
	else:
		print($"x! = {x!}\n");
```

This program will print this line to the console:

> ```
> x! = 10
> ```

As you can see, the optional chaining operator does *not* "remove" the optionality entirely, as now the variable `v2m` still *could* be `none`. If the "base expression" of an optional chain is `none` the whole optional chain will resolve to `none`, no matter how long that chain may be. The above example is not quite useful, as we could just check for the presence of a value in `v2m` directly here, but think about nested optionals and you want to access a field deep inside the structure, you then could stack optional chains together and get *one* value in *one* expression. Here is a small example of that:

<div class="warning">

Nested optional chains do not work properly yet

I am working on getting them up and running, but they do not work yet. The semantics and syntax of them is already fixed, though, so what you see below will not change much in the future.

</div>

```rs
use Core.print

data Vec2:
	i32 x;
	i32 y,
	Vec2(x, y);

data Nested:
	Vec2? v2m;
	Nested(v2m);

def main():
	Vec2 v2 = Vec2(10, 20);
	Vec2? v2m = v2;
	Nested n = Nested(v2m);
	Nested? nm = n;
	
	i32? x = nm?.v2m?.x;
	if x == none:
		print("one value in the chain has has no value!\n");
	else:
		print($"x! = {x!}\n");
```

This program will print this line to the console:

> ```
> x! = 10
> ```

As you can see, optional chains allow you to access fields deep inside optional chains. And now we can also talk about what type an optional chain has. The whole chain does **always** have the type of the rightmost operation wrapped in an optional. An operation could be a call, an access, or anything else, realistically. But it's important to know that **the whole chain has either the value as it's end or it had a `none` value somewhere in between thus resulting in `none` itself**.

You can also mix and match optional chains with optional force-unwrapping. In the above example, we can for example write `nm!.v2m?.x` and have a force-unwrap on the nested but a optional chain on the vec itself. This style also **clearly communicates intent**. From this small snippet you can directly see the assertions of the programmer: The programmer asserts that `nm` will *always* have a value, whereas `v2m` within `nm` could *potentially* be `none`, so you need to handle that *potential* case of the value's absence. It's not only a nicee QOL improvement, but it also very clearly communicates intent, without a single comment written. Also, the `!` and `?` are unique to optionals, so whenever you find one of those operators you can be *sure* that there is an optional in play. Well, that operator exists in a different form for variants as well, namely the `!(T)` and `?(T)` operator, but you will learn about variants in the next chapter.
