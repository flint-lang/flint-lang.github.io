# Inline Array Initialization

Up until this point, we have always initialized the entire array with a given value, like `i32[10](0)` where the entire array of `10` elements is filled with the value `0`. But, arrays also can be inline-initialized. Insetad of the `(<value>)` syntax we use the `{<value>, ...}` syntax:

```ft
use Core.print

def main():
	i32[3] v3 = i32[3]{10, 20, 30};
	for (i, elem) in v3:
		print($"v3[{i}] = {elem}\n");
```

This program will print these lines to the console:

> ```
> v3[0] = 10
> v3[1] = 20
> v3[2] = 30
> ```

Inline-initialized arrays **must** have a known size, meaning that an inline-iniitalized array initializer will _always_ result in a fixed array being created. That fixed array, as we saw earlier, can be cast to a dynamic array implicitely, this means that you an use a inline-initialized fixed array in all places where a dynamic array is requested. This is especially handy when just want to create a "temporary" array to be used inside a function, for example:

```ft
use Core.print

def print_flags(str[] flags):
	for (i, flag) in flags:
		print($"flags[{i}] = {flag}\n");

def main():
	print("0:\n");
	print_flags(str[0]{});

	print("1:\n");
	print_flags(str[1]{"f1"});

	print("2:\n");
	print_flags(str[2]{"f1", "f2"});

	print("3:\n");
	print_flags(str[3]{"f1", "f2", "f3"});
```

This program will print these lines to the console:

> ```
> 0:
> 1:
> flags[0] = f1
> 2:
> flags[0] = f1
> flags[1] = f2
> 3:
> flags[0] = f1
> flags[1] = f2
> flags[2] = f3
> ```

However, always needing to add a length can become pretty cumbersome pretty fast.

## Inferring the array length

We can use the default-operator `_` here again to infer the size of the inline-initialized array:

```ft
use Core.print

def print_flags(str[] flags):
	for (i, flag) in flags:
		print($"flags[{i}] = {flag}\n");

def main():
	print("0:\n");
	print_flags(str[_]{});

	print("1:\n");
	print_flags(str[_]{"f1"});

	print("2:\n");
	print_flags(str[_]{"f1", "f2"});

	print("3:\n");
	print_flags(str[_]{"f1", "f2", "f3"});
```

This program has the same output as the program above. As you can also see, it is also possible to inline-initialize empty arrays, arrays with no size. This is valid, since the array cast to an dynamic array, and those can be empty.

## Storing empty arrays

However, we can _not_ store an fixed empty array anywhere:

```ft
use Core.print

def main():
	// This is okay
	i32[] a1 = i32[_]{};

	// This is not
	i32[0] a2 = i32[_]{};
```

This program will print this compile error:

> ```
> Analyzing Error at main.ft:8:5
> └─┬┤E0000│
> 3 │ def main():
> 8 │ »   i32[0] a2 = i32[_]{};
> ┌─┴─────┘
> └─ Stored fixed arrays cannot be empty
> ```

because...why would we want to?? It makes no sense to store a _fixed_ empty array. We know that this array will **always** be empty, which means it could be removed from a codebase entirely and nothing would have changed. The `.len` will always return `0`, every access is an out-of-bounds access, since there are no elements in the array, and it has no runtime size either.
