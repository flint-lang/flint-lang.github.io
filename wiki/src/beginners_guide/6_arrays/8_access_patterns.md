# Access Patterns

Ranges allow you to **access segments** of an array or extract slices. This is especially powerful for creating subsets of arrays.

## Using Ranges

- **Closed Ranges**: Specify a start and end (both inclusive).

```rs
int[] slice = arr[2..4]; // Elements from index 2 to 4 (inclusive)
```

- **One-Sided Ranges**: Leave one side open to indicate "to the start" or "to the end."

```rs
int[] slice = arr[3..]; // All elements from index 3 to the end
int[] slice = arr[..2]; // All elements from the start to index 2
```

- **Open Ranges**: Open on both sides, indicating **all elements**.

```rs
int[] slice = arr[..]; // Equivalent to copying the whole array
```

## Extracted Slices are Copies

When using ranges, Flint always creates a **new array** as a copy of the slice.
