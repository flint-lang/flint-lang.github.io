# Multi-Types

Multi-Types are essentially vectorized variants of *some* primitive types to increase both readability, performance (SIMD) and ease of use for vectorized math operations and much more. Here is an example of how multi-types work:

```rs
use Core.print

def main():
    i32x3 v3 = (1, 2, 3);
    print($"v3.(x, y, z) = ({v3.x}, {v3.y}, {v3.z})\n");
    v3.(x, y, z) = (4, 5, 6);
    print($"v3.(x, y, z) = ({v3.x}, {v3.y}, {v3.z})\n");
```

This program will print these lines to the console:

```
v3.(x, y, z) = (1, 2, 3)
v3.(x, y, z) = (4, 5, 6)
```

As you can see, the 3-width i32 multi-type has the "fields" of x, y and z, each being of type `i32`. There exist several multi-types in Flint today:

| Type    | Element Type | Vector Size | "Field" Names      |
|:-------:|:------------:|:-----------:|:-------------------|
| `i32x2` | `i32`        | 2           | `x`, `y`           |
| `i32x3` | `i32`        | 3           | `x`, `y`, `z`      |
| `i32x4` | `i32`        | 4           | `r`, `g`, `b`, `a` |
| `i32x8` | `i32`        | 8           | `$N`               |
| `i64x2` | `i64`        | 2           | `x`, `y`           |
| `i64x3` | `i64`        | 3           | `x`, `y`, `z`      |
| `i64x4` | `i64`        | 4           | `r`, `g`, `b`, `a` |
| `f32x2` | `f32`        | 2           | `x`, `y`           |
| `f32x3` | `f32`        | 3           | `x`, `y`, `z`      |
| `f32x4` | `f32`        | 4           | `r`, `g`, `b`, `a` |
| `f32x8` | `f32`        | 8           | `$N`               |
| `f64x2` | `f64`        | 2           | `x`, `y`           |
| `f64x3` | `f64`        | 3           | `x`, `y`, `z`      |
| `f64x4` | `f64`        | 4           | `r`, `g`, `b`, `a` |
| `bool8` | `bool`       | 8           | `$N`               |

All multi-types with less than width 4 can be accessed via the field names directly, while all multi-types which are bigger, like `i32x8` can only be accessed with the same index-based accesser like tuples through the `.$N` syntax. This is also the reason why tuples needed to be explained before multi-types.

## Multi-Types with Functions

But let's move on to functions, because multi-types can be returned from functions too, unlike tuples. So, we can very well define a function like this:

```rs
use Core.print

def get_vec_2(i32 x, i32 y) -> i32x2:
    return (x, y);

def main():
    (x, y) := get_vec_2(10, 20);
    print($"(x, y) = ({x}, {y})\n");
```

This program will print this line to the console:

> (x, y) = (10, 20)

## Multi-Type Arithmetic

Multi-types are **primitive types** in Flint, which means that they have first-class arithmetic support. The mutli-type variant of any type supports the same arithmetic operations as its underlying type. Here is one example of this:

```rs
use Core.print

def main():
    i32x4 v4_1 = (1, 2, 3, 4);
    i32x4 v4_2 = (5, 6, 7, 8);
    i32x4 sum = v4_1 + v4_2;
    print($"sum = ({sum.r}, {sum.g}, {sum.b}, {sum.a})\n");
```

This program will print this line to the console:

> sum = (6, 8, 10, 12)

## Important Note

When using Multi-Types you gain free access to SIMD instructions. SIMD means **S**ingle **I**nstruction, **M**ultiple **D**ata and its a very optimized way of doing operations, such as additions. For example, adding two `i32x4` variables is just as fast as adding a single `i32` variable. This makes Flint's multi-types both extremely fast and extremely easy to use.
