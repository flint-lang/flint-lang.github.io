# Generic Functions

Generic functions are nothing truly special in Flint compared to other languages which have monomorphization capabilites. You can add the CPL to the function definition, just like you were able to add it to the `data` definition in the last chapter. Lets start with a simple and small function, `add`, as usual:

```ft
use Core.print

def add[type T](T x, T y) -> T:
	return x + y;

def main():
	i32 res1 = add[i32](10, 20);
	print($"res1 = {res1}\n");

	f32 res2 = add[f32](3.14, 4.5);
	print($"res2 = {res2}\n");

	str res3 = add[str]("Hello", ", there!");
	print($"res3 = {res3}\n");
```

This program will print these lines to the console:

> ```
> res1 = 30
> res2 = 7.64
> res3 = Hello, there!
> ```

Just like with generic data, generic functions are specialized when used. The specialization of generic functions, however, is a bit more involved compared to generic data components. In the case of generic data components, the "body" of the definitions is parsed exactly once. For generic functions, however, the body cannot be parsed just once because body-parsing requires type-information. Because of this, the body of any generic function is simply registered as text (tokens) and parsed on-demand for every specialization.

This means that a generic function which is never specialized can, quite literally, contain **anything** in its body and it is never parsed, and thus never checked in any way:

```ft
use Core.print

def foo[type T](T x) -> T:
	ahahsdl := alsdfba(T);

def main():
	print("Hello, World!\n");
```

This program just prints hello world, even though the body of the `foo` function clearly is completely wrong. You need to use the generic function at least once in order to parse it:

```ft
use Core.print

def foo[type T](T x) -> T:
	ahahsdl := alsdfba(T);

def main():
	print("Hello, World!\n");
	i32 res = foo[i32](10);
```

This program will result in this compile error:

> ```
> Parse Error at main.ft:4:16
> └─┬┤E0000│
> 3 │ def foo[type T](T x) -> T:
> 4 │ »   ahahsdl := alsdfba(T);
> ┌─┴────────────────┘
> └─ Call of undefined function 'alsdfba(i32)'
>
> Parse Error at main.ft:8:15
> └─┬┤E0000│
> 6 │ def main():
> 8 │ »   i32 res = foo[i32](10);
> ┌─┴───────────────┘
> ├─ Call of undefined function 'foo(int)'
> └─ Possible functions you could mean:
>     └─ foo[type T](const T x) from file 'main.ft'
> ```

As you can see, we get two compile errors. First the fact that `alsdfba(i32)` does not exist and this is the reason specialization of the `foo` function fails. Because specialization failed, the specialized `foo` function never was added to the file, only the generic `foo` function exists in it. This is the reason for the second compile error, which tells us that only the generic function `foo` exists but no specialized version of it was found.

## Generic type inferrence

When calling generic functions we need to provide the CVL and then provide the actual parameter of the call. However, it often happens that the parameters we pass to a function contain one of the types we defined in the CPL. For this very reason, Flint supports the ability to infer the type in the CPL from the runtime parameter list of a call instead:

```ft
use Core.array
use Core.print

def append[type T](mut T[] arr, T value):
	insert[_](arr, value, arr.len);

def print[type T](T[] arr):
	print("[");
	for (i, elem) in arr:
		if i > 0:
			print(", ");
		print(str(elem));
	print("]\n");

def main():
	i32[] arr = i32[_]{1, 2, 3, 4};
	append[_](arr, 5);
	append[_](arr, 6);
	print[_](arr);
```

This program will print this line to the console:

> ```
> [1, 2, 3, 4, 5, 6]
> ```

As you can see, we did not specify the type `T` explicitely even once, it was inferred entirely from the parameter of type `T[]` passed to the functions. This is also the first time you see the `Core.array` module in action. It contains only generic functions which lower to low-level code regarding array manipulation and now that you are aware of generic functions, you can use them effectively. The default-operator `_` is used in this example, like everywhere else, to note "infer", "default" or "discard", as these are the only operations this operator is used for, as you most likely know by now.

## Important note

Generic functions are **not** able to be defined as `export`ed or `extern`. Every extern and exported function needs to be a concrete, "real" function without a comptime parameter list.
