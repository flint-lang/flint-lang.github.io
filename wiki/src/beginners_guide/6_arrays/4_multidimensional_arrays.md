# Multidimensional Arrays

Flint supports **multidimensional arrays**. In Flint, these arrays are **always rectangular**, meaning that the length of each dimension is locked, unlike _jagged arrays_, which behave more like "array of arrays". Multidimensional Arrays are particularly useful for storing grid-like data, such as images or matrices.

## Declaring Multidimensional Arrays

The number of commas between the brackets of the array type directly indicates the dimensionality of an array. So, the array `i32[]` is a one-dimensional array (we have one "line" of values), then `i32[,]` is a two-dimensional array (we have a "plane" of values), `i32[,,]` is a three-dimensional array (we have a "cube" of values) and so on. There is no limit to how high the dimensionality of an array can be, really. We start with dimensionality of `1` because a dimensionality of `0` is already defined: its a single value, so `i32` is "an array of 0 dimensionality" if you want to see it like this.

When declaring a multi-dimensional array we use the same syntax as for "normal" arrays, with the same default-value that gets put into all elements of the array as usual:

```ft
def main():
    // 2D array
    i32[,] plane = i32[10, 10](0);
    // 3D array
    i32[,,] cube = i32[10, 10, 10](0);
```

Here, we defined the `plane` array to be of size `10 × 10`, which means there can be stored `100` elements in this two-dimensional array. We also defined the `cube` array to be of size `10 × 10 × 10`, which means there can be stored `1000` elements in this three-dimensional array.

## Accessing Multidimensional Arrays

To access and assign elements at a given index we need to specify the index of each dimensionality explicitely. For our plane, this would mean that we need to specify the "row" and the "column" of the plane, or the "x" and the "y" coordinates (if the plane is seen as a coordinate plane).

```ft
use Core.print

def main():
    i32[,] plane = i32[10, 10](0);
    // Set the element at row 1, column 2
    plane[1, 2] = 10;
    print($"plane[1, 2] = {plane[1, 2]}\n");
```

This program will print this line to the console:

> ```
> plane[1, 2] = 10
> ```

## Getting the lengths of multi-dimensional arrays

In the last chapter we talked about how we can access the length of strings and arrays by the `.length` field on them. This also is true for multi-dimensional arrays. But we have more than one dimension, so how is it possible to get the lengths in one `u64` variable? Thats a good question, and the answer is very simple: we don't.

Instead, when accessing the `.length` field of an array we _actually_ get a group of size `N`, where `N` is the dimensionality of the array. So, if we access the `.length` field of an one-dimensional array we get a group of size 1, so we get one `u64` value. If we access the `.length` field on the `plane` array we will get a `(u64, u64)` group as a return, and if we access the length of a 3D array like our `cube` we will get a `(u64, u64, u64)` group as the lengths value, one value for each dimension:

```ft
use Core.print

def main():
    i32[,] plane = i32[10, 20](0);
    (x, y) := plane.length;
    print($"plane.length = ({x}, {y})\n");
```

This program will print this line to the console:

> ```
> plane.length = (10, 20)
> ```

## Iterating over Multidimensional Arrays

Now that we know how to access the lengths of a multi-dimensional array we also can iterate through the array. And for this very reason we need to discuss **row-major** vs **column-major** formats. In Flint, arrays are **always** stored in row-major format, but what does this mean and why is it important?

The array format describes how elements are layed out in memory. Multi-dimensional arrays are essentially "fake"... and in this small section you will also learn why the distinction between the `str` type and the `u8[]` type is important. Lets get started then...

Multi-dimensional arrays are "fake" because the values are _still_ stored in **one** contiguous line in memory. Lets look at this easy example here to understand it better: a `i32[,]` array where each dimensionality has the size of `3`. Below is a small table in which we give every element a unique ID, from top left to bottom right. We actually start counting at the top left at 0:

|      | `X0` | `X1` | `X2` |
| :--: | :--: | :--: | :--: |
| `Y0` |  0   |  1   |  2   |
| `Y1` |  3   |  4   |  5   |
| `Y2` |  6   |  7   |  8   |

What this table tells us is that `arr[0, 2]` would be the value of `6` (x = 0, y = 2). Okay, so the difference between row-major and column-major is this one:

In **Row-Major** format, the array is stored in memory like this:

```
0 1 2 3 4 5 6 7 8
```

In **Column-Major** format, the array is stored in memory like this:

```
0 3 6 1 4 7 2 5 8
```

Note that the numbers that have been chosen do not matter at all, they are just to showcase how it works under the hood. For you, it actually doesn't really matter if it would be saved in row-major or column-major format, if you access arr[0, 2] you would get the same value (`X0`, `Y2`) for both formats, its just a matter of how it's saved to memory. But this very reason, how it is saved to memory, is really important for one and only one reason: **_performance_**.

You see, when we iterate over an array we can choose between those two methods:

```ft
use Core.print

def main():
    i32[,] mat = i32[3, 3](0);
    i32 n = 0;
    // Row-major looping + fills the array
    for u32 y = 0; y < 3; y++:
        for u32 x = 0; x < 3; x++:
            mat[x, y] = n;
            print($"mat[{x}, {y}] = {mat[x, y]}\n");
            n++;

    // Print one empty line in between
    print("\n");

    // Column-major looping
    for u32 x = 0; x < 3; x++:
        for u32 y = 0; y < 3; y++:
            print($"mat[{x}, {y}] = {mat[x, y]}\n");
```

This program will print these lines to the console:

> ```
> mat[0, 0] = 0
> mat[1, 0] = 1
> mat[2, 0] = 2
> mat[0, 1] = 3
> mat[1, 1] = 4
> mat[2, 1] = 5
> mat[0, 2] = 6
> mat[1, 2] = 7
> mat[2, 2] = 8
>
> mat[0, 0] = 0
> mat[0, 1] = 3
> mat[0, 2] = 6
> mat[1, 0] = 1
> mat[1, 1] = 4
> mat[1, 2] = 7
> mat[2, 0] = 2
> mat[2, 1] = 5
> mat[2, 2] = 8
> ```

As you can see, the two looping techniques directly correlate to the order the elements are stored in memory for the examples i have provided you with above. But what is more performant now? If you access the element at `mat[1, 2]` you are actually accessing the `8th` element of the array (when starting to count at `1` here). Because in row-major format, when accessing the element at the third row (y is the row, x is the column) we first need to go through all elements of the two rows that came before it, which is `6` elements.

So, you may be able to see now that the index at which we would read memory from would constantly jump between positions when iterating through an array using column-major looping whereas when we loop through the array using row-major looping we go through all indices of the two-dimensional array one by one. This is called a **sequentail operation** and the other one is called a **random operation** in computer science. The CPU is **much** more performant with sequential operations than it is with random operations, as it is not as prone to **cache-misses** with sequential loads. If you want to read more about this topic, look [here](https://www.hostinger.com/uk/tutorials/cache-miss).

TLDR: The row-major loop properly utilizes the CPU cache and reduces cache-misses, making the operations _much_ faster in return.

Before you wonder why i told you all of this, everything i talked about becomes important in the next chapter!
