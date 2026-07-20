# Introduction to Arrays

An **array** is a data structure that stores a collection of elements sequentially in memory. Arrays are useful for storing multiple values of the same type, such as numbers, strings, vectors, or even custom data components. In Flint, arrays are **immutable by default** in terms of references; assigning one array to another always creates a **copy**, not a reference.

- Arrays are always **stored sequentially** in memory, making access to their elements efficient.
- Arrays are **value types** in Flint. This means copying an array creates a **new, independent copy** of its data.
- If you modify an array inside a `data` instance, you should **access it directly** using `instance.array` instead of copying it out, as changes made to the copy won’t automatically reflect back in the original array.
- They are part of the **complex data type** category of Flint (like `data` and `str`), so passing them to functions passes them as a reference, not as a copy.

## Creating Arrays

To declare a one-dimensional array, we write brackets after the base type of the array, for example `i32[]` for an array of `i32` values:

```ft
def main():
    i32[] arr = i32[10](0);
```

This program does not print anything to the console. We create an array of type `i32[]` and store it on the variable `arr`. We **initialize** the array quite similar to how we would initialize `data`. For `data`, we wrote the **name** of the data type, followed by parenthesis in which we wrote the initializer arguments. For arrays, this works a bit different. First of all, we need to provide a **size** in between the squared brackets, in the above example the size will be set to `10`, which means that the array `arr` will contain `10` values of type `i32`. And lastly, the `(0)`. For arrays, we need to define a "default-value" with which all array elements are filled. In our case, this is the `i32` value of `0`, which means that every single one of the `10` elements in the array has the value `0` stored in it after the arrays creation.

## Accessing Elements

To access an element of an array we use `[N]`, where `N` is the index we want to access. Here is a small example of that:

```ft
use Core.print

def main():
    i32[] arr = i32[10](0);
    i32 elem_3 = arr[3];
    print($"elem_3 = {elem_3}\n");
```

This program will print this line to the console:

> ```
> elem_3 = 0
> ```

Okay, the array is of size `10` and we start counting at `0`, so the last index we are allowed to access is `9`...what happens if we access index `10`? In some languages this would yield into a hard crash of the program, in other it is undefined behaviour. Flint contains extra safety-guards in place for out-of-bounds checks. If we try to compile and run this program:

```ft
use Core.print

def main():
    i32[] arr = i32[10](0);
    i32 elem_10 = arr[10];
    print($"elem_10 = {elem_10}\n");
```

This program will print these lines to the console:

> ```
> Out Of Bounds access occured: Arr Len: 10, Index: 10
> elem_10 = 0
> ```

As you can see, Flint just continues with execution. When you try to access an value thats outside the bounds of the array, Flint will just clamp the index to the last element of the array instead, and printing a message that an Out Of Bounds access has occured. You can change Flint's behaviour for OOB-handling with the `--array` flag. Run `flintc --array --help` now, it contains an in-depth explaination about each mode, what each mode means and what you need them for.

Try compiling the above code with the different array options set and see for yourself how the Flint program behaves. Flint aims to be as safe and as verbose (in its output) as possible and we try to make safety the default and let you opt-out of safety (for example through the `--array unsafe` flag) if you are 100% sure that OOB accesses are impossible for your program.

## Assigning Values

To assign new values to elements of the array we use the same bracket-syntax as before:

```ft
use Core.print

def main():
    i32[] arr = i32[10](0);
    arr[3] = 8;
    arr[4] = 4;
    print($"arr[3] + arr[4] = {arr[3] + arr[4]}\n");
```

This program will print this line to the console:

> ```
> arr[3] + arr[4] = 12
> ```

## Grouped Access and Assignment

Just like with tuples, vectors, data or basically any type in Flint, arrays have some form of interoperability with groups too. The syntax looks a bit different, though. Here is the same example as above, but using a grouped assignment:

```ft
use Core.print

def main():
    i32[] arr = i32[10](0);
    arr.[3, 4] = (8, 4);
    print($"arr[3] + arr[4] = {arr[3] + arr[4]}\n");
```

This program will print this line to the console:

> ```
> arr[3] + arr[4] = 12
> ```

As you can see, instead of doing `.(x, y)` (for example for `i32x2`) we write `.[idx1, idx2]`. We definitely need the `.` in front of the `[` symbol to differentiate a grouped array access from a multi-dimensional array access, but you will learn about multi-dimensional arrays soon.

Just like we can write grouped array assignments, we also are able to access multiple different indices of arrays at the same time too. This allows us to do things like element-swaps of arrays without temporary variables:

```ft
use Core.print

def main():
	i32[] arr = i32[4](0);
	for (i, elem) in arr:
		elem = i32(i);
	for (i, elem) in arr:
		print($"arr[{i}] = {elem}\n");
	print("\n");

	arr.[1, 2] = arr.[2, 1];
	for (i, elem) in arr:
		print($"arr[{i}] = {elem}\n");
```

This program will print these lines to the console:

> ```
> arr[0] = 0
> arr[1] = 1
> arr[2] = 2
> arr[3] = 3
>
> arr[0] = 0
> arr[1] = 2
> arr[2] = 1
> arr[3] = 3
> ```

In this example we have swapped the values on indices `1` and `2` respectively. Just like any group, there are no limits to how many values we can swap at the same time, we also could write `arr.[0, 1, 2, 3] = arr.[2, 1, 3, 0];` too if we would want to. Just like any grouped assignment, storing the values in the array works from left to right, and loading them works from left to right too. All values are loaded from the array from left to right to produce the group of `(2, 1, 3, 0)` and then that group is stored on the indices from left to right, so `arr[0] = 2`, `arr[1] = 1`, `arr[2] = 3` and `arr[3] = 0` respectively. Try it for yourself and play around a bit to get a better feeling for grouped accesses and assignments!
