# Access Patterns

But ranges can not only be used for string slicing, but for array slicing too. It pretty much works exactly the same as when slicing strings, and it even has the absolute same syntax, since strings are more or less character arrays under the hood too.

```ft
use Core.print

def main():
	i32[] arr = i32[10](0);
	for (idx, elem) in arr:
		elem = i32(idx + 1);

	i32[] slice = arr[2..8];
	print($"slice.length = {slice.length}\n");
	for (idx, elem) in slice:
		print($"slice[{idx}] = {elem}\n");
```

This program will print these lines to the console:

> ```
> slice.length = 6
> slice[0] = 3
> slice[1] = 4
> slice[2] = 5
> slice[3] = 6
> slice[4] = 7
> slice[5] = 8
> ```

