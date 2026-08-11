# Basic Syntax

## Primitive Types

| Type  | Description                  |          Min         |         Max         | Precision      |
| :---: | :--------------------------- | :------------------: | :-----------------: | :------------- |
| `u8`  | unsigned 8 bit integer       |          `0`         |        `255`        | Whole numbers  |
| `u16` | unsigned 16 bit integer      |          `0`         |       `65536`       | Whole numbers  |
| `u32` | unsigned 32 bit integer      |          `0`         |   `4,294,967,295`   | Whole numbers  |
| `u64` | unsigned 64 bit integer      |          `0`         |  ≈ `1.844 × 10^19`  | Whole numbers  |
| `i8`  | signed 8 bit integer         |        `-128`        |        `127`        | Whole numbers  |
| `i16` | signed 16 bit integer        |       `-32768`       |       `32767`       | Whole numbers  |
| `i32` | signed 32 bit integer        |   `-2,147,483,648`   |   `2,147,483,647`   | Whole numbers  |
| `i64` | signed 64 bit integer        |  ≈ `-9.223 × 10^18`  |  ≈ `9.223 × 10^18`  | Whole numbers  |
| `f32` | 32 bit floating point number |  ≈ `±3.402 × 10^-38` | ≈ `±3.402 × 10^38`  | ≈ 6 - 9 digits |
| `f64` | 64 bit floating point number | ≈ `±1.798 × 10^-308` | ≈ `±1.798 × 10^308` | ≈ 16 digits    |

## Program Structure

```ft
// Core module imports, Core modules contain the fundamental
// primitives which cannot be implemented in Flint itself
use Core.print

// Main function entry point
def main():
    print("Hello, World!\n");
```

## Compiling & Testing

```sh
flintc hello.ft --out hello   # build binary 'hello'
flintc main.ft --test         # build test binary 'test'
```

## Comments

```ft
// line comment
/* block comment */
```

## Indentation

Scope is defined by indentation using hard-tabs (also accepted as 4 spaces per level). Statements end with `;`.

```ft
use Core.print

def main():
    i32 x = 5;
    if x > 3:
        print("big\n");
```

## Variables

```ft
// Typed declaration
i32 x = 5;

// Reassignment
x = 7;

// '_' digit separators
u32 n = 4_294_967_290;
```

- Statically typed, the type is fixed at declaration.
- No shadowing: the same identifier can only be declared once per scope.
- Integer overflow/underflow clamps to the type's min/max instead of wrapping.
- Integer division truncates the fractional part (`100 / 30` is `3`).

## Inferred Typing

```ft
// Every literal has a "default-inferred" type
// inferred as i32
x := 42;

// inferred as f32
pi := 3.14;

// inferred str
msg := "Hello!";
```

`:=` is only allowed for variables.

## Operators

```ft
// Arithmetic
n1 + n2;
n1 - n2;
n1 * n2;
n1 / n2;

// String concatenation
hello + world;

// Comparison
x == y;
x != y;

// Increment (also -=, *=, /=)
x++;
x += 1;
```

Standard order of operations; use parentheses for grouping. Do not compare floats with `==` (IEEE-754 imprecision).

## Type Casting

```ft
// explicit cast, fractional part is cut off
i32 val = i32(3.3);

// implicit cast allowed if no info is lost
f32 f = 3;

// any type casts implicitly to str
str s = "n = " + n; 
```

## String Interpolation

```ft
print($"x = {x}, y = {y}\n");
```

## Boolean Logic

```ft
a and b;
a or b;
not a;
```

## Branching

```ft
if cond:
    ...
else if cond:
    ...
else:
    ...
```

## Loops

```ft
// While loop
while cond:
    ...

// Do-While loop
do:
    // runs at least once
    ...
while cond;

// C-Style for loop
for i32 i = 0; i < 5; i++:
    // i scoped to the loop
    ...

// Enhanced for loop
for (idx, elem) in iterable:
    ...
```

`break` and `continue` work as expected; `i++` is `i += 1`.

## Enums

```ft
// auto-numbered 0, 1, 2
enum MyEnum:
    TAG1, TAG2, TAG3;

// explicit values
enum Flags:
    A = 1,
    B = 2,
    C = 4;
```

```ft
MyEnum e = MyEnum.TAG1;
if e == MyEnum.TAG1:
    ...

// Enums can be cast to strings and to integers
str name = str(e);
i32 id = i32(e);
```

## Switch

No `case`/`break`/fallthrough. Statement form:

```ft
switch result:
    BIGGER:
        print("is bigger\n");
    SMALLER:
        print("is smaller\n");
```

Expression form:

```ft
i32 result = switch e:
    VAL1 -> 1;
    VAL2 -> 2;
```

## Functions

```ft
// no params, no return
def greet():
    ...

// typed params + return
def add(i32 a, i32 b) -> i32:
    ...

// multiple returns (group)
def split() -> (i32, i32):
    ...

// CLI args
def main(str[] args):
    ...

// Main function may return exit code
def main(str[] args) -> i32:
    ...
```

- Declaration order is irrelevant; call any function from anywhere.
- Parameters are immutable by default (`mut` keyword opts in).
- Multiple returns: `return (a, b);` and `(a, b) := split();`.
- Discard a return value with `_`.

## Tests

```ft
use Core.assert

test "adds numbers":
    i32 result = add(2, 3);
    assert(result == 5);
```
