# Multidimensional Access Patterns

Just like ranges can be used for one-dimensional arrays for slicing, they can be used for multi-dimensional rectangular arrays as well. There are more things to watch out for for multi-dimensional array slicing, though. The most important part is the one about **dimensionality reduction**, but what even is this? Well, when we create a two-dimensional rectangular array of type `i32[,]` with `i32[10, 10](0)` the array has, obviously, a dimensionality of 2. If we now access the multi-dimensional array by it's indices like `arr[0, 3]` we get a single value, a scalar. This is equivalent to a result array of dimensionality `0`, being a single value. So, what happens if we use a range instead of a single index when accessing multi-dimensional arrays?

```ft
use Core.print

def main():
	i32[,] arr = i32[10, 10](0);
	(I, J) := arr.length;
	for j := 0; j < J; j++:
		for i := 0; i < I; i++:
			arr[i, j] = (i + 1) * (j + 1);

	i32[] slice = arr[1, 2..8];
	for (idx, elem) in slice:
		print($"slice[{idx}] = {elem}\n");
```

This program will print these lines to the console:

> ```
> slice[0] = 6
> slice[1] = 8
> slice[2] = 10
> slice[3] = 12
> slice[4] = 14
> slice[5] = 16
> ```

As you can see, the dimensionality of the array access `arr[1, 2..8]` is `1`. This is a fundamental rule of array slicing, and if you think about it a bit more it actually makes a lot of sense. **Every scalar index in an array access reduces the result dimensionality by 1**. So, when we have a 2D array and we access a specific value at a given x and y index, then we get one value, dimensionality 0. But with ranges we can express something even cooler: To access a slice of a multi-dimensional array. Imagine a 10x10 plane, which is our `arr` in this case. The operation `arr[1, 2..8]` just means that we look at the second column and from that column we take all elements from the index 2 to 8. Here is a small visualization of that:

> ```
> × × × × × × × × × ×
> × × × × × × × × × ×
> × O × × × × × × × ×
> × O × × × × × × × ×
> × O × × × × × × × ×
> × O × × × × × × × ×
> × O × × × × × × × ×
> × O × × × × × × × ×
> × × × × × × × × × ×
> × × × × × × × × × ×
> ```

All the `×` mark the original `arr` and the `O` are the result of the slicing expression. Okay, so what happens if we do not fix the first index to 1 but provide a range there instead too?


```ft
use Core.print

def main():
	i32[,] arr = i32[10, 10](0);
	(I, J) := arr.length;
	for j := 0; j < J; j++:
		for i := 0; i < I; i++:
			arr[i, j] = (i + 1) * (j + 1);

	i32[,] slice = arr[3..6, 2..8];
	for (idx, elem) in slice:
		print($"slice[{idx}] = {elem}\n");
```

This program will print these lines to the console:

> ```
> slice[0] = 12
> slice[1] = 15
> slice[2] = 18
> slice[3] = 16
> slice[4] = 20
> slice[5] = 24
> slice[6] = 20
> slice[7] = 25
> slice[8] = 30
> slice[9] = 24
> slice[10] = 30
> slice[11] = 36
> slice[12] = 28
> slice[13] = 35
> slice[14] = 42
> slice[15] = 32
> slice[16] = 40
> slice[17] = 48
> ```

And when we visualize it again we get this matrix:

> ```
> × × × × × × × × × ×
> × × × × × × × × × ×
> × × × O O O × × × ×
> × × × O O O × × × ×
> × × × O O O × × × ×
> × × × O O O × × × ×
> × × × O O O × × × ×
> × × × O O O × × × ×
> × × × × × × × × × ×
> × × × × × × × × × ×
> ```

And when we print the array we print from left to right before going down. This is why we get all multiples of `3` first, then the multiples of `4` and so on. But you may be able to see why ranges and ranged accesses are so powerful for multi-dimensional arrays. Through them we can just extract a plane from a cube, a column from a plane, or like above a small sub-segment array without much hassle. The internal code which handles this all is pretty optimized and it will be faster to use slicing instead of writing your own code to extract a sub-plane from another plane (2d array), for example.
