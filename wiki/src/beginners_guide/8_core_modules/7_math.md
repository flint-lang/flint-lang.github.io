# math

```ft
use Core.math
```

The `math` module provides math functions which are used very frequently in math-heavy workloads.

| Function Name | Parameter Types | Return Types | Possible Errors |
| :-----------: | :-------------: | :----------: | :-------------: |
|     `sin`     |      `f32`      |    `f32`     |       No        |
|     `sin`     |      `f64`      |    `f64`     |       No        |
|      <hr>     |                 |              |                 |
|     `cos`     |      `f32`      |    `f32`     |       No        |
|     `cos`     |      `f64`      |    `f64`     |       No        |
|      <hr>     |                 |              |                 |
|    `sqrt`     |      `f32`      |    `f32`     |       No        |
|    `sqrt`     |      `f64`      |    `f64`     |       No        |
|      <hr>     |                 |              |                 |
|     `abs`     |      `i32`      |    `i32`     |       No        |
|     `abs`     |      `i64`      |    `i64`     |       No        |
|     `abs`     |      `f32`      |    `f32`     |       No        |
|     `abs`     |      `f64`      |    `f64`     |       No        |
|      <hr>     |                 |              |                 |
|     `min`     |   `u32`, `u32`  |    `u32`     |       No        |
|     `min`     |   `u64`, `u64`  |    `u64`     |       No        |
|     `min`     |   `i32`, `i32`  |    `i32`     |       No        |
|     `min`     |   `i64`, `i64`  |    `i64`     |       No        |
|     `min`     |   `f32`, `f32`  |    `f32`     |       No        |
|     `min`     |   `f64`, `f64`  |    `f64`     |       No        |
|      <hr>     |                 |              |                 |
|     `max`     |   `u32`, `u32`  |    `u32`     |       No        |
|     `max`     |   `u64`, `u64`  |    `u64`     |       No        |
|     `max`     |   `i32`, `i32`  |    `i32`     |       No        |
|     `max`     |   `i64`, `i64`  |    `i64`     |       No        |
|     `max`     |   `f32`, `f32`  |    `f32`     |       No        |
|     `max`     |   `f64`, `f64`  |    `f64`     |       No        |

## error sets

These are the error sets this Core module provides.

## sin

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


## cos

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

## sqrt

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

## abs

The `abs` function returns the absolute value of the given signed value parameter. Note that this function only has overloads for signed integers and floating point types. If the input of the integer overloads of the `abs` function is `I32_MIN` or `I64_MIN` then `I32_MAX` or `I64_MAX` is returned instead (one smaller than the "real" absolute value would be).

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

## min

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

## max

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
