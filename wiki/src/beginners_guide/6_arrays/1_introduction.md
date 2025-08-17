# Introduction to Arrays

An **array** is a data structure that stores a collection of elements sequentially in memory. Arrays are useful for storing multiple values of the same type, such as numbers, strings, or even custom data modules. In Flint, arrays are **immutable by default** in terms of references — assigning one array to another always creates a **copy**, not a reference.

- Arrays are always **stored sequentially** in memory, making access to their elements efficient.
- Arrays are **value types** in Flint. This means copying an array creates a **new, independent copy** of its data.
- If you modify an array inside a data object, you should **access it directly** using data.array instead of copying it out, as changes made to the copy won’t automatically reflect back in the original array.
- They are considered complex data types, so passing them to functions passes them as a reference, not a copy.

## Creating Arrays

To declare a one-dimensional array, we write brackets after the array type, for example `i32[]` for an array of `i32` values:

```ft
def main():
    i32[] arr = i32[10](0);
```

This program does not print anything to the console, but we need to talk about it nonetheless and talk about whats happening here. So, we create an array of type `i32[]` and store it on the variable `arr`. We **initialize** the array quite similar to how we would initialize `data`. For `data`, we wrote the **name** of the data type, followed by parenthesis in which we wrote the initializer arguments. For arrays, this works a bit differently. First of all, we need to provide a **size** in between the squared brackets, in the above example the size will be set to `10`, which means that the array `arr` will contain `10` values of type `i32`. And lastly, the `(0)`. For arrays, we need to define a "default-value" with which all array elements are filled. In our case, this is the `i32` value of `0`, which means that every single one of the 10 elements in the array has the value `0` stored in it after the arrays creation.

## Accessing Elements

To access an element of an array we need to use a new syntax, different from when we accessed elements of the tuple via `.$N`. Now, for arrays, we need to access it using `[N]`, where `N` is the index we want to access. Here is a small example of that:

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

Okay, the array is of size `10` and we start counting at `0`, so the last index we are allowed to access is `9`...what happens if we access index `10`? In most languages this would yield into a hard crash of the program, but in Flint we have extra safety-guards in place for out-of-bounds checks. But try it for yourself, try to compile and run this program:

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

As you can see, Flint just continues with execution. When you try to access an value thats outside the bounds of the array, Flint will just clamp the index to the last element of the array instead, and printing a message that an Out Of Bounds access has occured. You can actually change Flint's behaviour for OOB-handling with the **Array Options**. Here is a small cutout of the help message of the compiler:

> ```
> Array Options:
>   --array-print               [Default] Prints a small message to the console whenever accessing an array OOB
>   --array-silent              Disables the debug printing when OOB access happens
>   --array-crash               Hard crashes when an OOB access happens
>   --array-unsafe              Disables all bounds checks for array accesses
> ```

Try compiling the above code with the different array options set and see for yourself how the Flint program behaves. Flint aims to be as safe and as verbose (in its output) as possible and we try to make safety the default and let you opt-out of safety (for example through the --array-unsafe flag) if you are 100% sure that OOB accesses are impossible for your program.

## Assigning Values

To assign new values to elements of the array we use the same accessing-syntax as before:

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

<div class="warning">

This feature is not yet implemented in the compiler

Currently, this feature does not yet work in the current version of the compiler, but it is **definitely** planned to be implemented in a later version.

</div>

Just like with tuples, mutli-types, data or basically any type in Flint, arrays have some form of interoperability with groups too. The syntax looks a bit different, though. Here is the same example as above, but using a grouped assignment:

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
