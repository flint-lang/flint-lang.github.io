# Multidimensional Arrays

Flint supports **multidimensional arrays**. In flint, these are **always rectangle arrays**, meaning that the length of each dimension is locked, unlike *jagged arrays*, which behave more like "array of arrays". Arrays are particularly useful for storing grid-like data, such as images or matrices.

## Declaring Multidimensional Arrays

The number of commas (`[,]`) in the declaration indicates the number of dimensions:

```rs
int[,] arr; // 2D array
int[,,] cube; // 3D array
```

## Initializing Multidimensional Arrays

To initialize a multidimensional array:

1. **Using Defaults**:
```rs
int[,] arr = int[5, 5]; // 5x5 array with default value (0)
```
2. **Using a Specific Value**:
```rs
arr := int[5, 5](4); // 5x5 array with all values set to 4
```

## Accessing Multidimensional Arrays

Use indices for each dimension:

```rs
arr[1, 2] = 10; // Set the element at row 1, column 2
print(arr[1, 2]); // Access the element
```
