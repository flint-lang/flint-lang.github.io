# Introduction to Arrays

An **array** is a data structure that stores a collection of elements sequentially in memory. Arrays are useful for storing multiple values of the same type, such as numbers, strings, or even custom data modules. In Flint, arrays are **immutable by default** in terms of references—assigning one array to another always creates a **copy**, not a reference.

## Key Points About Flint Arrays

1. Arrays are always **stored sequentially** in memory, making access to their elements efficient.
2. Arrays are **value types** in Flint. This means copying an array creates a **new, independent copy** of its data.
3. If you modify an array inside a data object, you should **access it directly** using data.array instead of copying it out, as changes made to the copy won’t automatically reflect back in the original array.

## Creating and Accessing Arrays

To declare a one-dimensional array, use the following syntax:

```rs
int[] arr; // Declare an uninitialized array
arr = int[5]; // Create an array with 5 elements initialized to the default value (0)
```

To assign values to specific elements or access them:

```rs
arr[0] = 10; // Set the first element to 10
int val = arr[0]; // Access the first element
```

## Example: Using Arrays in Flint

```rs
def main():
    int[] arr = int[5]; // Create a 1D array of size 5
    arr[0] = 10;
    arr[1] = 20;
    print($"arr[0]: {arr[0]}, arr[1]: {arr[1]}");
```
