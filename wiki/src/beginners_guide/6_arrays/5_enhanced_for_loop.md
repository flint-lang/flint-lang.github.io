# Enhanced for Loops

Enhanced for loops are for loops without explicitely declaring a range, but instead they directly operate on a so-called **iterable**. They are extremely useful for iterating through arrays, as enhanced for loops will **always** iterate through a multidimensional array _sequentially_.

Here is a small example:

```ft
use Core.print

def main():
    i32[] arr = i32[5](0);
    // First, fill the array with meaningful values
    for i := 0; i < arr.length; i++:
        arr[i] = i * 2;

    // Iterate through the array element by element
    for (idx, elem) in arr:
        print($"Index {idx}, Value {elem}\n");
```

This program will print these lines to the console:

> ```
> Index 0, Value 0
> Index 1, Value 2
> Index 2, Value 4
> Index 3, Value 6
> Index 4, Value 8
> ```

Okay, lets go through everything about the enhanced for loops one by one. You surely wonder what this `(idx, elem)` is, and why it looks like a group, right? Well, because it is! When iterating through an iterable we _always_ get the index as the first value of the iteration context (the group) and the element at that index as the second value of the iteration context.

Note that `elem` is a **mutable reference** to the array element. So, writing `elem = ...` is the same as if you would write `arr[..] = `. Here is an example:

```ft
use Core.print

def main():
    i32[] arr = i32[5](0);
    // First, fill the array with meaningful values
    for (idx, elem) in arr:
        elem = idx * 2;

    // Iterate through the array element by element
    for (idx, elem) in arr:
        print($"Index {idx}, Value {elem}\n");
```

This program will print these lines to the console:

> ```
> Index 0, Value 0
> Index 1, Value 2
> Index 2, Value 4
> Index 3, Value 6
> Index 4, Value 8
> ```

As you can see, modifying `elem` directly modifies the array at the current index inplace. This is _extremely_ powerful for mutli-dimensional arrays, because yes, multidimensional arrays are considered iterables too!

## Not using index or elem

We can opt out of using the `index` or `elem` variables for enhanced for loops entirely through the `_` operator. Again, it is used in the context of `unused` here. Here is a small example:

```ft
use Core.print

def main():
    i32[] arr = i32[5](0);
    // Just fill the array with stuff
    for (idx, elem) in arr:
        elem = idx * 2;

    // Ignoring the index value in the enhanced for loop
    for (_, elem) in arr:
        print($"elem is {elem}\n");

    // Ignoring the elem in the enhanced for loop
    for (idx, _) in arr:
        print($"Iteration {idx}\n");
```

This program will print these lines to the console:

> ```
> elem is 0
> elem is 2
> elem is 4
> elem is 6
> elem is 8
> Iteration 0
> Iteration 1
> Iteration 2
> Iteration 3
> Iteration 4
> ```

## Iterating through Mutlidimensional Arrays

As multidimensional arrays are also considered **iterables** we can use the enhanced for loop on multi-dimensional arrays just like we did with the nested for loops:

```ft
use Core.print

def main():
    i32[,] plane = i32[3, 3](0);

    for (index, elem) in plane:
        elem = i32(index);

    for y := 0; y < 3; y++:
        for x := 0; x < 3; x++:
            print($"plane[{x}, {y}] = {plane[x, y]}\n");
```

This program will print these lines to the console:

> ```
> plane[0, 0] = 0
> plane[1, 0] = 1
> plane[2, 0] = 2
> plane[0, 1] = 3
> plane[1, 1] = 4
> plane[2, 1] = 5
> plane[0, 2] = 6
> plane[1, 2] = 7
> plane[2, 2] = 8
> ```

As you can see, using the enhanced for loop for multi-dimensional arrays yields both the best performance, as we iterate sequentially through the whole array, we have an easy counter to see in which iteration we are and we can modify each element of the multi-dimensional array one by one. If you ever need to modify each element of the array without necessarily needing the positional information (`x` and `y` in our case) enhanced for loops are your friend!

## Iteration Context

It was said earlier that the group with the index and the element is called the **iteration context** but what does this mean and why does it have a name? Its actually pretty simple: Because this context can be a tuple variable as well!

The `index` of the iteration context is always a `const` variable, while the `elem` of it is always a `mut` "variable" (its a reference). The iteration context as a tuple itself is `const`, and the `elem` field of it (the second field of the tuple) is not a mutable reference anymore, but its an immutable copy (for primitives) or an immutable reference (for complex data types) instead. This means that when using a tuple as the iteration context, we can no longer change the iterable directly through the `elem` reference. Here is an example:

```ft
use Core.print

def main():
    i32[] arr = i32[5](0);
    // First, initialize the array, as always
    for (idx, elem) in arr:
        elem = idx * 2;

    for ctx in arr:
        print($"{ctx.$0}: {ctx.$1}\n");
```

This program will print these lines to the console:

> ```
> 0: 0
> 1: 2
> 2: 4
> 3: 6
> 4: 8
> ```

## Enhanced for loop for strings

You can also iterate over a string using the enhanced for loop, just like you can for arrays. Here is an example of this in action:

```ft
use Core.print

def main():
    str my_string = "something useful";
    for (idx, elem) in my_string:
        if idx == 2 or idx == 4:
            // The difference between upcase and lowercase is 32
            u8 tmp_elem = elem;
            elem = tmp_elem - u8(32);

    print($"my_string = '{my_string}'\n");
```

This program will print this line to the console:

> ```
> my_string = 'soMeThing useful'
> ```
