# Arrays

## Dynamic Arrays

```ft
// 10 elements, all 0
i32[] arr = i32[10](0);

// assign
arr[3] = 8;

// access
i32 v = arr[3];

// u64 length (`.len` also works)
arr.length;
```

- Sequential in memory, value types: assigning one array to another copies.
- Complex types are passed to functions by reference.
- Out-of-bounds access is safe: it prints a message and clamps to the last index. Control with `flintc --array <mode>` (e.g. `unsafe`).

Grouped access, e.g. `arr.[3, 4] = (8, 4)` and multi-index swaps, is covered in [Groups](./4_groups.md#grouped-array-access).

## Iterating

```ft
// C-style
for u32 i = 0; i < arr.length; i++:
    arr[i] = i32(i * 2);
```

Enhanced for loop: `elem` is a **mutable reference** into the array:

```ft
for (idx, elem) in arr:
    // writes at arr[idx]
    elem = i32(idx * 2);

// discard index
for (_, elem) in arr:
// discard element
for (idx, _) in arr:
```

The iteration context group `(idx, elem)` can be captured whole as `ctx` (`ctx.$0`, `ctx.$1`); the tuple form is `const` and `elem` is then read-only.

## Strings

```ft
str name = "Marc";

// 'r', ASCII only
u8 third = name[2];

// write a character
name[2] = 'R';

// u64
name.length;
```

Strings are `u8[]` under the hood; characters are `u8`. Supports slicing (see Ranges).

## Multidimensional Arrays

```ft
// 2D
i32[,] plane = i32[10, 10](0);

// 3D
i32[,,] cube = i32[10, 10, 10](0);
plane[1, 2] = 10;

// length is a group with one value per dimension
(x, y) := plane.length;
```

Commas in the type encode dimensionality; always rectangular and row-major (iterate innermost on `x` for cache efficiency).

## Ranges & Slicing

```ft
// [0, 6) exclusive end
0..6

// copy of chars 2..6
string[2..7]

// from 2 to end
string[2..]

// from begin to 5, same as 0..5
string[..5]

// whole copy, same as 0..
string[..]

// array slicing
arr[2..8];

// multi-dimensional slicing works too
arr2d := arr3d[2..3, 4, 5..6];
```

Ranges are iterable:

```ft
// i = 0..4, elem = 5..9
for (i, elem) in 5..10:
    ...
```

## Fixed Arrays

```ft
// compile-time size, no heap alloc
i32[3] v3 = i32[3](0);

// grouped
v3.[0, 1, 2] = (10, 20, 30);
```

A runtime length makes the initializer produce a dynamic `i32[]`, which is not assignable to `i32[3]`. Fixed arrays cast implicitly to dynamic arrays.

## Inline Array Initialization

```ft
// fixed array
i32[3] v3 = i32[3]{10, 20, 30};

// '_' infers length
print_flags(str[_]{"f1", "f2"});

// empty is fine when cast to dynamic
print_flags(str[_]{});

// error: stored fixed arrays cannot be empty
i32[0] a = i32[_]{};
```
