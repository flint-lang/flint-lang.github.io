# Iterating Over Arrays

Often, you will want to process each element of an array inside of a loop. For this, you can easily use a `for` loop, like so:

```ft
use Core.print

def main():
    i32[] arr = i32[5](4);
    // Set each element to the double of the index
    for i := 0; i < 5; i++:
        arr[i] = i * 2;
        print($"Index: {i}, Value: {arr[i]}\n");
```

This program will print these lines to the console:

> ```
> Index: 0, Value: 0
> Index: 1, Value: 2
> Index: 2, Value: 4
> Index: 3, Value: 6
> Index: 4, Value: 8
> ```

With loops, we can better demonstrate the OOB-behaviour mentioned in the last chapter. Here is an example to better demonstrate this behaviour:

```ft
use Core.print

def main():
    i32[] arr = i32[5](4);
    for i := 0; i < 10; i++:
        arr[i] = i * 2;
        print($"Index: {i}, Value: {arr[i]}\n");

    print("\n");
    for i := 0; i < 5; i++:
        print($"Index: {i}, Value: {arr[i]}\n");
```

This program will print these lines to the console:

> ```
> Index: 0, Value: 0
> Index: 1, Value: 2
> Index: 2, Value: 4
> Index: 3, Value: 6
> Index: 4, Value: 8
> Out Of Bounds access occured: Arr Len: 5, Index: 5
> Out Of Bounds access occured: Arr Len: 5, Index: 5
> Index: 5, Value: 10
> Out Of Bounds access occured: Arr Len: 5, Index: 6
> Out Of Bounds access occured: Arr Len: 5, Index: 6
> Index: 6, Value: 12
> Out Of Bounds access occured: Arr Len: 5, Index: 7
> Out Of Bounds access occured: Arr Len: 5, Index: 7
> Index: 7, Value: 14
> Out Of Bounds access occured: Arr Len: 5, Index: 8
> Out Of Bounds access occured: Arr Len: 5, Index: 8
> Index: 8, Value: 16
> Out Of Bounds access occured: Arr Len: 5, Index: 9
> Out Of Bounds access occured: Arr Len: 5, Index: 9
> Index: 9, Value: 18
>
> Index: 0, Value: 0
> Index: 1, Value: 2
> Index: 2, Value: 4
> Index: 3, Value: 6
> Index: 4, Value: 18
> ```

You can spot two out of bounds accesses here. The first one happens when we want to assign `i * 2` to the array at `i` and the second one is in the printing when trying to print `arr[i]` in the string interpolation. And then, at the end we print the current values of the array and you can clearly see that the last element at index 4 holds the value 18, which is double the last index of the last loop. As you can see, OOB accesses are considered "safe" in Flint, because it is well-defined what will happen when an OOB access occurs.
