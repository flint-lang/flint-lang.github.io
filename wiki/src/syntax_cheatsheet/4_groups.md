# Groups

Groups are swizzles: a way to operate on multiple values at the same time, like expressing simultaneity natively. They have **no runtime footprint** (the values live only in CPU registers/cache) and are not stored anywhere. Whenever possible, grouped operations vectorize (see [Vectors](./2_data.md#vectors)).

Groups are not *just* swizzles, they are a broader concept of expressing simultaneity *including* swizzling.

## Grouped Assignment & Swaps

```ft
// swap, no temp needed
(x, y) = (y, x);

// multi-swap
(a, b, c, d) = (c, d, a, b);

// assign one value to many
(a, b, c, d) = (a, a, a, a);
```

Evaluation rules:

- The right-hand side is evaluated completely **before** any assignment happens.
- Assignment applies left to right: `(a, a, a) = (a + 1, a + 2, a + 3)` leaves `a` as the rightmost value.
- Assigning the same target multiple times is allowed but the compiler emits a warning.

## Grouped Data Access

```ft
// assign many fields at once
v3.(x, y, z) = (1, 2, 3);
v3.(x, y, z) += (1.0, 1.0, 1.0);

// read into variables
(x, y, z) := v3.(x, y, z);
```

`v3.(x, y, z)` is not only sugar for `(v3.x, v3.y, v3.z)`, it also produces better IR code as `v3` is only loaded once; typed as the group `(f32, f32, f32)`.

## Grouped Array Access

```ft
// multi-index write
arr.[3, 4] = (8, 4);

// swap, no temp
arr.[1, 2] = arr.[2, 1];

// fixed arrays too
v3.[0, 1, 2] = (10, 20, 30);
```

## Splatting (Broadcasting)

Splatting expands a scalar into a homogeneous group of size `N`. It applies in **arithmetic**:

```ft
i32x3 v = (10, 20, 30);
// (20, 40, 60) as 2 expands to (2, 2, 2)
v *= 2;
```

## Set-Like Comparisons

Compare a scalar against a group of the **same type** to test membership:

```ft
// true if x is one of {1, 2, 3}
if x == (1, 2, 3):
    ...

// true if x is none of {1, 2, 3}
if x != (1, 2, 3):
    ...

// <, <=, >, >= work too
if x < (2, 4, 6):
    ...
```

A group where all elements share a type is a **homogeneous group**. Set-like comparison does **not** apply splatting, as this would break some conditions like `(x, x, x) == (1, 2, 3)` will always result in `false` because `x` cannot be *all of them* at the same time.

## Enum Groups

```ft
if me == MyEnum.(VAL1, VAL3, VAL5):
    print("is VAL1, VAL3 or VAL5\n");
```

`MyEnum.(VAL1, VAL3, VAL5)` looks like a grouped field access but for enum values, producing a homogeneous group of type `(MyEnum, MyEnum, MyEnum)`. The same rules apply as for every set-like comparison.

## Related Grouped Syntax

- Multiple returns: `return (a, b);` received via `(a, b) := split();`.
- Tuples `data<i32, f32, str>`: index via `t.$0`, grouped via `t.($0, $1, $2)`.
- Vectors `i32x3 v = (1, 2, 3);` are group-like primitives with first-class SIMD arithmetic.
- Iteration context groups: `for (idx, elem) in arr:`.
