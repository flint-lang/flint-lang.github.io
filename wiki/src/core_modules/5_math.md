# math

```ft
use Core.math
```

The `math` module provides math functions which are used very frequently in math-heavy workloads.

## functions

### sin

```ft
def sin(f32 value) -> f32;
def sin(f64 value) -> f64;
```

The `sin` function executes the sine function on the given parameter. The parameter is in radians, so you need to convert it from degrees to radians before using it.

```ft
use Core.print
use Core.math

def main():
    f32 x = sin(0.5236)
    print($"x = {x}\n");
```

This program will print this line to the console:

> ```
> x = 0.5
> ```


### cos

```ft
def cos(f32 value) -> f32;
def cos(f64 value) -> f64;
```

The `cos` function executes the cosine function on the given parameter. The parameter is in radians, so you need to convert it from degrees to radians before using it.

```ft
use Core.print
use Core.math

def main():
    f32 x = sin(1.0472)
    print($"x = {x}\n");
```

This program will print this line to the console:

> ```
> x = 0.5
> ```

### sqrt

```ft
def sqrt(f32 value) -> f32;
def sqrt(f64 value) -> f64;
```

The `sqrt` function executes the sqare root on the given parameter.

```ft
use Core.print
use Core.math

def main():
    f32 x = sqrt(9.0);
    print($"x = {x}\n");
```

This program will print this line to the console:

> ```
> x = 3
> ```

### abs

```ft
def abs(i8 value) -> u8;
def abs(i16 value) -> u16;
def abs(i32 value) -> u32;
def abs(i64 value) -> u64;
def abs(f32 value) -> f32;
def abs(f64 value) -> f64;
```

The `abs` function returns the absolute value of the given signed value parameter. Note that this function only has overloads for signed integers and floating point types. Because these functions are guaranteed to return a unsigned value, the result types of the functions are unsinged. So even the smallest number, like `-128` in the `i8` case will then fit into the `u8` type (it would not have fit into a `i8` type as its maximum is `127`).

```ft
use Core.print
use Core.math

def main():
    i32 x = -2_147;
    print($"abs({x}) = {abs(x)}\n");
```

This program will print this line to the console:

> ```
> abs(-2147) = 2147
> ```

### min

```ft
def min(u8 l, u8 r) -> u8;
def min(i8 l, i8 r) -> i8;
def min(u16 l, u16 r) -> u16;
def min(i16 l, i16 r) -> i16;
def min(u32 l, u32 r) -> u32;
def min(i32 l, i32 r) -> i32;
def min(u64 l, u64 r) -> u64;
def min(i64 l, i64 r) -> i64;
def min(f32 l, f32 r) -> f32;
def min(f64 l, f64 r) -> f64;
```

The `min` function simply returns the minimum of two given values.

```ft
use Core.print
use Core.math

def main():
    i32 x = 121;
    i32 y = 234;
    print($"min({x}, {y}) = {min(x, y)}\n");
```

This program will print this line to the console:

> ```
> min(121, 234) = 121
> ```

### max

```ft
def max(u8 l, u8 r) -> u8;
def max(i8 l, i8 r) -> i8;
def max(u16 l, u16 r) -> u16;
def max(i16 l, i16 r) -> i16;
def max(u32 l, u32 r) -> u32;
def max(i32 l, i32 r) -> i32;
def max(u64 l, u64 r) -> u64;
def max(i64 l, i64 r) -> i64;
def max(f32 l, f32 r) -> f32;
def max(f64 l, f64 r) -> f64;
```

The `max` function simply returns the maximum of two given values.

```ft
use Core.print
use Core.math

def main():
    i32 x = 121;
    i32 y = 234;
    print($"max({x}, {y}) = {max(x, y)}\n");
```

This program will print this line to the console:

> ```
> max(121, 234) = 234
> ```
