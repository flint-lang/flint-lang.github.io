# Variant Extraction

Similar to how the variant unwrapping operator `!(T)` had similarities to the optional force-unwrap operator `!`, the variant extraction operator `?(T)` has equally as much similarities to the optional chaining operator `?`. As a quick reminder, the optional chaining operator was used to, well, form chained expressions from optionals like `maybe?.field_maybe?.field` where the result of the whole chain always was `T?`, either the chain succeeded or it failed.

The variant extraction operator `?(T)` slots right into that same machinery and it pretty much works identiacally to the optional chaining operator. Where for optional chaining you either _have_ a value or you _don't_, for variants it's more nuanced as you could have one of many types. But you either _have_ a value of a given type or you _don't_. So, we van use the variant extraction operator `?(T)` _within_ optional chains and mix and match them as we wish, and the result of that optional chain has the type `T?`, because either all parts of the chain succeeded or _any_ part of the chain returned `none` as result.

Let's look at a more simple case for the extraction operator before moving on to the more complicated chaining approach.

```ft
use Core.print

variant MyVar:
	i32, f32, str;

def main():
	MyVar var = -5;

	i32? i = var?(i32);
	f32? f = var?(f32);

	if i != none:
		print($"i == {i!}\n");
	else:
		print("i == none\n");

	if f != none:
		print($"f == {f!}\n");
	else:
		print("f == none\n");
```

This program will print these lines to the console:

> ```
> i == -5
> f == none
> ```

As you can see, the variant extraction operator `?(T)` has quite a few similarities to the optional chaining operator `?`, so much that it can be used within optional chains too. Let's look at the more complicated example now:

<div class="warning">

This example does not work yet

Flint does not yet support stacking variant extractions with optional chains. It will be supported eventually, but the compiler is currently unable to compile the program below.

</div>

```ft
use Core.print
use Core.assert

data MyData:
	i32 x;
	f32 y;
	MyData? next;
	MyData(x, y, next);

variant MyVar:
	i32, Data(MyData?), str;

def main():
	MyData? md = MyData(10, 20, MyData(30, 40, none));
	MyVar var = md;

	i32? x = var?(MyVar.Data).x;
	assert(x != none);
	i32? x2 = var?(MyVar.Data).next?.x;
	assert(x2 != none):
	print($"x = {x!}\n");
	print($"x2 = {x2!}\n");
```

This program will print these lines to the console:

> ```
> x = 10
> x2 = 30
> ```

You can see quite a lot of information packed into that little program above, actually. First of all we must extract the tagged variation through it's tag again. Also, `MyData` is a linked list in this example containing an optional next field. This example was chosen to showcase the ability to mix and match variant extractions with optional chains. Because the variant extraction essentially works exactly the same as the optional chaining operator we will not go i depth here, it should be clear how it works by now.
