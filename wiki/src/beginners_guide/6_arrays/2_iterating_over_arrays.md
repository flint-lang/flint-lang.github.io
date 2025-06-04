# Iterating Over Arrays

Often, you’ll want to process each element of an array. Flint supports **two types of loops** for working with arrays:

1. **Index-Based Loops**: Ideal for accessing and modifying elements at specific indices.
2. **Enhanced For Loops**: Useful for iterating over all elements with simpler syntax.

## Using the Index-Based Loop

```rs
def main():
    // Initialize array of size 5 with values of 4
    arr := int[5](4);
    // Set each element to the double of the index
    for i := 0; i < 5; i++:
        arr[i] = i * 2;
    print($"arr[3]: {arr[3]}"); // prints 'arr[3]: 6'
```

## Using the Enhanced For Loop

In enhanced for loops, you can access both the index (i) and the element (elem), as learned in chapter [4](#4):

```rs
def main():
    int[] arr = int[5](6); // Initialize array
    for i, elem in arr:
        print($"Index: {i}, Value: {elem}");
```

Output:

> ```
> Index: 0, Value: 6
> Index: 1, Value: 6
> Index: 2, Value: 6
> Index: 3, Value: 6
> Index: 4, Value: 6
> ```

## Iterables in Flint

Flint arrays are **iterable**, meaning they can be used in enhanced for loops. Other iterables include **ranges**, which we’ll discuss later. Remember: the choice of loop depends on whether you need access to indices (`i`) or also elements (`elem`).

**Hint**: The type of the indices (`i`) is *always* of type *uint* (no signed int values) and the type of the elements (`elem`) is *always* the type of the array elements. If you create a `str` array (`str[]`), for example, `elem` will be of type `str`.
