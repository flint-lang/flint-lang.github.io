# Fixed Arrays

A fixed array is nothing more than an array with a compile-time known size. Since the size of the array is compile-time known, the array does not need to be heap-allocated like regular dynamic arrays we handled thus far. The difference between dynamic and fixed arrays is in their respective type:

```ft
use Core.print

def main():
	i32[3] v3 = i32[3](0);
	v3.[0, 1, 2] = (10, 20, 30);
	for (i, elem) in v3:
		print($"v3[{i}] = {elem}\n");
```

This program will print these lines to the console:

> ```
> v3[0] = 10
> v3[1] = 20
> v3[2] = 30
> ```

Fixed arrays are an important part of Flints type-system. The array initializer `i32[3](0)` actually creates an array with a compile-time known size, namely an array of type `i32[3]`. If we would change the length value of `3` to a runtime variable, like `l` for example, the initializer will create a dynamic array of type `i32[]` instead and it will no longer be assignable to the variable `v3`:

```ft
use Core.print

def main():
	u64 l = 3;
	i32[3] v3 = i32[l](0);
	v3.[0, 1, 2] = (10, 20, 30);
	for (i, elem) in v3:
		print($"v3[{i}] = {elem}\n");
```

This program will result in this compile error:

> ```
> Parse Error at main.ft:5:17
> └─┬┤E0000│
> 3 │ def main():
> 5 │ »   i32[3] v3 = i32[l](0);
> ┌─┴─────────────────┘
> └─ Type mismatch of expression
>     ├─ Expected: i32[3]
>     └─ But got:  i32[]
> ```

We as the reader can see that `l` has the value of `3` but never is changed, but the Flint compiler cannot tell that _yet_. Compile-time execution and a lot of work regarding better analyzation will be added soon™. As you can see, it is _not_ possible to assign a dynamic array to a fixed array, as the size of the dynamic array is runtime-dependent, while the size of the fixed array is fixed.

It is, however, possible to assign a fixed array to a dynamic array, as then a dynamic array is newly created to fit the fixed array. This is the reason why all previous examples with fixed-size initializers even worked at all.
