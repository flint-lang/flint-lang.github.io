# Data

## Defining Data Components

```ft
data Vector2:
    i32 x;
    i32 y;
    // Data definitions need a constructor: order of fields to pass when instantiating data
    Vector2(x, y);
```

Fields, then a constructor line listing how to initialize them. Defining `data` creates a new type.

## Instantiation & Field Access

```ft
// x = 10, y = 20
Vector2 v2 = Vector2(10, 20);

// single field write
v2.x = 15;
print($"v2.x = {v2.x}\n");
```

Grouped field access, e.g. `v3.(x, y, z) = (1, 2, 3)`, is covered in [Groups](./4_groups.md#grouped-data-access).

## Default Values

```ft
data MyData:
    i32 x = 5;
    i32 y = 7;
    MyData(x, y);

def main():
    // x uses default 5
    MyData a = MyData(_, 20);

    // all defaults (only if every field has one)
    MyData b = MyData(_);
```

Using `_` on a field without a default is a compile error.

## Nested Data

```ft
data Rectangle:
    Point top_left;
    Point bottom_right;
    Rectangle(top_left, bottom_right);
```

Construction **deep-clones**; later changes to the source fields do not affect the copy. Data cannot contain itself (use optionals `T?` for linked lists).

## Data in Functions

```ft
// p is immutable
def print_point(Point p):
    ...

// mut opts into mutation
def increment_by(mut Point p):
    p.(x, y) += (1, 1);

def create_point(i32 x, i32 y) -> Point:
    return Point(x, y);
```

Mutability: locals are mutable by default (`const` opts out), parameters immutable by default (`mut` opts in). Only pass mutable arguments to `mut` params.

## Tuples

```ft
// anonymous, typed inline
data<i32, f32, str> t = (3, 2.2, "hello!");

// index-based accesses
t.$0 = 7;

// grouped
t.($0, $1, $2) = (7, 4.7, "yes");
```

- Not DIMA-managed; cannot be returned from a function directly (return a group `(T, T)` instead).
- A tuple type overlapping a vector type is not allowed (`data<i32, i32, i32>` -> use `i32x3`).

## Vectors

```ft
i32x3 v3 = (1, 2, 3);

// width 2..4: xyz / uv / st / ij / rgba
assert(v3.x == v3.r);
assert(v3.y == v3.j);
assert(v3.z == v3.b);

// index access, any width
v3.$0;

// SIMD arithmetic by default, one instruction per op
i32x4 sum = v4_1 + v4_2;
```

Types: `u8xN`…`i64xN` widths 2–4 (and 8 for some), `f32xN`, `f64xN`, `bool8`. Vectors are primitives with first-class arithmetic and free SIMD.

## Type Aliasing

```ft
// clause: no semicolon
type SomeTuple data<i32, f32, u64>
type Int i32

def main():
    SomeTuple st = (-10, 2.3, 2);
```

## Const Data

```ft
const data Globals:
    i32 x = 10;
    MyData md = MyData(10, 38.2, "Hello 2");
```

Compile-time globals which are substituted at compile-time. `Globals.x` is a literal expression substitution (like `#define`); function calls inside are still executed at runtime.

## Shared Data

```ft
shared data Globals:
    i32 c = init();
    i32 c2 = init2();

// safe: uses Globals.c, order is guaranteed
def init2() -> i32:
    Globals.c++;
    return Globals.c;
```

Runtime global variables. Within one `shared data` (and within one file) initialization runs in definition order; across file boundaries order is not guaranteed.
