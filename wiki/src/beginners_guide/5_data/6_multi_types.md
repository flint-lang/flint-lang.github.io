# Multi-Types

Multi-Types are essentially vectorized variants of _some_ primitive types to increase both readability, performance (SIMD) and ease of use for vectorized math operations and much more. Here is an example of how multi-types work:

```ft
use Core.print

def main():
    i32x3 v3 = (1, 2, 3);
    print($"v3.(x, y, z) = ({v3.x}, {v3.y}, {v3.z})\n");
    v3.(x, y, z) = (4, 5, 6);
    print($"v3 = {v3}\n");
```

This program will print these lines to the console:

> ```
> v3.(x, y, z) = (1, 2, 3)
> v3 = (4, 5, 6)
> ```

As you can see, the 3-width i32 multi-type has the "fields" of x, y and z, each being of type `i32`. There exist several multi-types in Flint today:

|  Type   | Element Type | Vector Size |
| :-----: | :----------: | :---------: |
| `u8x2`  |    `u8`      |      2      |
| `u8x3`  |    `u8`      |      3      |
| `u8x4`  |    `u8`      |      4      |
| `u8x8`  |    `u8`      |      8      |
|  <hr>   |              |             |
| `i32x2` |    `i32`     |      2      |
| `i32x3` |    `i32`     |      3      |
| `i32x4` |    `i32`     |      4      |
| `i32x8` |    `i32`     |      8      |
|  <hr>   |              |             |
| `i64x2` |    `i64`     |      2      |
| `i64x3` |    `i64`     |      3      |
| `i64x4` |    `i64`     |      4      |
|  <hr>   |              |             |
| `f32x2` |    `f32`     |      2      |
| `f32x3` |    `f32`     |      3      |
| `f32x4` |    `f32`     |      4      |
| `f32x8` |    `f32`     |      8      |
|  <hr>   |              |             |
| `f64x2` |    `f64`     |      2      |
| `f64x3` |    `f64`     |      3      |
| `f64x4` |    `f64`     |      4      |
|  <hr>   |              |             |
| `bool8` |    `bool`    |      8      |

All multi-types with less than width 4 can be accessed via the field names directly, while all multi-types which are bigger, like `i32x8` can only be accessed with the same index-based accesser like tuples through the `.$N` syntax. This is also the reason why tuples needed to be explained before multi-types. There actually exist several aliases for each component, each being unambiguous. Below is a table describing which "field" names exist for each component:

| Width | Field 0 | Field 1 | Field 2 | Field 3 |
| :---: | :-----: | :-----: | :-----: | :-----: |
|   2   |   `u`   |   `v`   |         |         |
|  <hr> |         |         |         |         |
|   2   |   `i`   |   `j`   |         |         |
|   3   |   `i`   |   `j`   |   `k`   |         |
|   4   |   `i`   |   `j`   |   `k`   |   `l`   |
|  <hr> |         |         |         |         |
|   2   |   `x`   |   `y`   |         |         |
|   3   |   `x`   |   `y`   |   `z`   |         |
|   4   |   `x`   |   `y`   |   `z`   |   `w`   |
|  <hr> |         |         |         |         |
|   2   |   `s`   |   `t`   |         |         |
|   3   |   `s`   |   `t`   |   `p`   |         |
|   4   |   `s`   |   `t`   |   `p`   |   `q`   |
|  <hr> |         |         |         |         |
|   3   |   `r`   |   `g`   |   `b`   |         |
|   4   |   `r`   |   `g`   |   `b`   |   `a`   |

As you can see, different widths have different aliases for the coordinates. The `u` and `v` aliases for vectors of size two, for example, are used a lot in UV-coordinate systems, and `rgba` just starts at three components, because just having `r` and `g` for two-sized vectors does not make any sense.

The names are designed in a way that eliminates collisions in every case. The same letter will always be used for the same coordinate. If we would have added `uvw`, like it nomally would be, the `w` would collide with the fourth field in `xyzw`, so now it would be ambiguous whether `w` is the third or fourth field of a multi-type without knowing the type upfront, which would be really bad UX. So, instead we opted to design the names in a way that completely eliminates ambiguity.

## Multi-Types with Functions

But let's move on to functions, because multi-types can be returned from functions too, unlike tuples. So, we can very well define a function like this:

```ft
use Core.print

def get_vec_2(i32 x, i32 y) -> i32x2:
    return (x, y);

def main():
    (x, y) := get_vec_2(10, 20);
    print($"(x, y) = ({x}, {y})\n");
```

This program will print this line to the console:

> ```
> (x, y) = (10, 20)
> ```

As you can see, interoperability between mutli-types and groups _just works_. **Groups** are Flint's "type interoperability layer". You can pack multiple single values into a group, then store it in a tuple. Or access multiple fields of a tuple and store it in a multi-type etc. Groups are the real "middle-ground" of Flint's type system, because you can return a group of `(i32, i32)` and still store it in a mutli-type or you can return a `i32x2` and store it in a group. The group, however, could also be a grouped assignment of a tuple, so you could very well write `tuple.($0, $2) = get_vec_2(10, 20);` and store the `i32x2` return value on the `$0` and `$2` fields of the tuple, because its a grouped assignment and groups are natively meant to be interoperable with Flint's other types.

## Multi-Type Arithmetic

Multi-types are **primitive types** in Flint, which means that they have first-class arithmetic support. The mutli-type variant of any type supports the same arithmetic operations as its underlying type. Here is one example of this:

```ft
use Core.print

def main():
    i32x4 v4_1 = (1, 2, 3, 4);
    i32x4 v4_2 = (5, 6, 7, 8);
    i32x4 sum = v4_1 + v4_2;
    print($"sum = {sum}\n");
```

This program will print this line to the console:

> ```
> sum = (6, 8, 10, 12)
> ```

## Important Note

When using Multi-Types you gain free access to SIMD instructions. SIMD means **S**ingle **I**nstruction, **M**ultiple **D**ata and its a very optimized way of doing operations, such as additions. For example, adding two `i32x4` variables is just as fast as adding a single `i32` variable. This makes Flint's multi-types both extremely fast and extremely easy to use.
