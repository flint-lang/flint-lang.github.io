# Multidimensional Access Patterns

Flint allows using ranges in **multidimensional arrays**, letting you extract slices easily. Fixed indices reduce the dimensionality of the result.

## Examples:

1. **Extracting a Row**:
```rs
int[] row = arr[2, ..]; // All elements in row 2
```
2. **Extracting a Column**:
```rs
int[] column = arr[.., 3]; // All elements in column 3
```
3. **Extracting a Plane**:
```rs
int[,] plane = cube[.., 2, ..]; // A 2D plane from a 3D array
// This returns a 2d array of all x and z values on index 2
```

## Resulting Dimensionality:

1. Fixing one dimension reduces the result by 1 dimension.
2. Fixing all dimensions results in a **single value**:
```rs
int value = cube[1, 2, 3]; // Single value at [1, 2, 3]
```

## Practical Example: Transposing a Matrix

```rs
// Transposing using range accessing
def transpose(int[,] matrix) -> int[,]:
    new_matrix := int[matrix[0, ..].length, matrix.length];
    for y := 0; y < matrix[0, *].length; y++:
        new_matrix[*, y] = matrix[y, *];
    return new_matrix;

// Transposing manually
def transpose(int[,] matrix) -> int[,]:
    /**
    The range operator has to be used here because there actually is no other way to
    find the length of the second dimension
    */
    new_matrix := int[matrix[0, ..].length, matrix.length];
    for x := 0; x < matrix.length; x++:
        for y := 0; y < matrix[0, ..].length; y++:
            new_matrix[y, x] = matrix[x, y];
    return new_matrix;
```

The slicing operation is not only cleaner for arrays, but it is more performant too, because multiple pieces of data can be copied simultaniously, whereas with manual indexing, each value is copied 1 by 1.

## Arrays in Loops

Using ranges and slices in loops is incredibly powerful:

```rs
for i, elem in arr[2..4]:
    print($"Index: {i}, Value: {elem}");
```

## Concurrency and Arrays

Flint’s range and array access patterns set the foundation for concurrent computations, enabling high performance. We’ll dive deeper into Flint’s concurrency model in later chapters.

## Conclusion

Arrays are a core part of programming in Flint, allowing you to store and manipulate sequential data efficiently. From basic one-dimensional arrays to advanced multidimensional access patterns, Flint’s array system is powerful and intuitive. With this foundation, you’re ready to explore Flint’s entities, which bring even more flexibility to your data-centric applications. Let’s continue!
