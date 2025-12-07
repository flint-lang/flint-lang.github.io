# parse

```ft
use Core.parse
```

The `parse` module provides functions related to parsing strings into other types.

| Function Name | Parameter Types | Return Types | Possible Errors |
| :-----------: | :-------------: | :----------: | :-------------: |
|  `parse_u8`   |      `str`      |    `u8`      |   `ErrParse`    |
|  `parse_i32`  |      `str`      |    `i32`     |   `ErrParse`    |
|  `parse_u32`  |      `str`      |    `u32`     |   `ErrParse`    |
|  `parse_i64`  |      `str`      |    `i64`     |   `ErrParse`    |
|  `parse_u64`  |      `str`      |    `u64`     |   `ErrParse`    |
|  `parse_f32`  |      `str`      |    `f32`     |   `ErrParse`    |
|  `parse_f64`  |      `str`      |    `f64`     |   `ErrParse`    |

## error sets

These are the error sets this Core module provides.

### ErrParse

This error set does not have a parent error, so it directly and only extends `anyerror` directly. These are the possible values this error could have:

| Error Value        | Description                                       |
| :----------------- | :------------------------------------------------ |
| `OutOfBounds`      | The input is out of the bounds of the result      |
| `InvalidCharacter` | The input contains one or more invalid characters |

## functions

These are the functions this Core module provides.

### parse_u8

The `parse_u8` function recieves a string which needs to be parsed to an `u8` type. If the string contains characters which are not allowed in an unsigned integer, e.g. any character that's not `[0..9]`, it will throw the `InvalidCharacter` error. If the string contains a negative integer, e.g. `-5` it will throw the `OutOfBounds` error, since a negative integer cannot be converted to an `u8` type. If the value in the string is above or equal to `256` it will also throw the `OutOfBounds` error since these values are too large to fit in an `u8` type too.

```ft
use Core.print
use Core.parse

def main():
    u8 val = parse_u8("-5") catch err:
        print("OutOfBounds\n");
    print($"val = {u32(val)}\n");

    val = parse_u8("300") catch err:
        print("OutOfBounds\n");
    print($"val = {u32(val)}\n");

    val = parse_u8("3.4") catch err:
        print("InvalidCharacter\n");
    print($"val = {u32(val)}\n");

    val = parse_u8("69");
    print($"val = {u32(val)}\n");
```

This program will print these lines to the console:

> ```
> OutOfBounds
> val = 0
> OutOfBounds
> val = 0
> InvalidCharacter
> val = 0
> val = 69
> ```

### parse_i32

The `parse_i32` function recieves a string which needs to be parsed to an `i32` type. If the string contains characters which are not allowed in an unsigned integer, e.g. any character that's not `[0..9]` or `-`, it will throw the `InvalidCharacter` error. If the value in the string is below or equal to `-2147483649` or if it's above or equal to `2147483648` it will throw the `OutOfBounds` error.

```ft
use Core.print
use Core.parse

def main():
    i32 val = parse_i32("-2147483649") catch err:
        print("OutOfBounds\n");
    print($"val = {val}\n");

    val = parse_i32("2147483649") catch err:
        print("OutOfBounds\n");
    print($"val = {val}\n");

    val = parse_i32("3.4") catch err:
        print("InvalidCharacter\n");
    print($"val = {val}\n");

    val = parse_i32("-34892");
    print($"val = {val}\n");
```

This program will print these lines to the console:

> ```
> OutOfBounds
> val = 0
> OutOfBounds
> val = 0
> InvalidCharacter
> val = 0
> val = -34892
> ```

### parse_u32

The `parse_u32` function recieves a string which needs to be parsed to an `u32` type. If the string contains characters which are not allowed in an unsigned integer, e.g. any character that's not `[0..9]`, it will throw the `InvalidCharacter` error. If the string contains a negative integer, e.g. `-5` it will throw the `OutOfBounds` error, since a negative integer cannot be converted to an `u32` type. If the value in the string is above or equal to `4294967296` it will also throw the `OutOfBounds` error since these values are too large to fit in an `u32` type too.

```ft
use Core.print
use Core.parse

def main():
    u32 val = parse_u32("-5") catch err:
        print("OutOfBounds\n");
    print($"val = {val}\n");

    val = parse_u32("4294967296") catch err:
        print("OutOfBounds\n");
    print($"val = {val}\n");

    val = parse_u32("3.4") catch err:
        print("InvalidCharacter\n");
    print($"val = {val}\n");

    val = parse_u32("34892");
    print($"val = {val}\n");
```

This program will print these lines to the console:

> ```
> OutOfBounds
> val = 0
> OutOfBounds
> val = 0
> InvalidCharacter
> val = 0
> val = 34892
> ```

### parse_i64

The `parse_i64` function recieves a string which needs to be parsed to an `i64` type. If the string contains characters which are not allowed in an unsigned integer, e.g. any character that's not `[0..9]` or `-`, it will throw the `InvalidCharacter` error. If the value in the string is below or equal to `I64_MIN` or if it's above or equal to `I64_MAX` it will throw the `OutOfBounds` error.

```ft
use Core.print
use Core.parse

def main():
    i64 val = parse_i64("-20000000000000000000") catch err:
        print("OutOfBounds\n");
    print($"val = {val}\n");

    val = parse_i64("20000000000000000000") catch err:
        print("OutOfBounds\n");
    print($"val = {val}\n");

    val = parse_i64("3.4") catch err:
        print("InvalidCharacter\n");
    print($"val = {val}\n");

    val = parse_i64("-34892");
    print($"val = {val}\n");
```

This program will print these lines to the console:

> ```
> OutOfBounds
> val = 0
> OutOfBounds
> val = 0
> InvalidCharacter
> val = 0
> val = -34892
> ```

### parse_u64

The `parse_u64` function recieves a string which needs to be parsed to an `u64` type. If the string contains characters which are not allowed in an unsigned integer, e.g. any character that's not `[0..9]`, it will throw the `InvalidCharacter` error. If the string contains a negative integer, e.g. `-5` it will throw the `OutOfBounds` error, since a negative integer cannot be converted to an `u64` type. If the value in the string is above or equal to `U64_MAX` it will also throw the `OutOfBounds` error since these values are too large to fit in an `u64` type too.

```ft
use Core.print
use Core.parse

def main():
    u64 val = parse_u64("-5") catch err:
        print("OutOfBounds\n");
    print($"val = {val}\n");

    val = parse_u64("20000000000000000000") catch err:
        print("OutOfBounds\n");
    print($"val = {val}\n");

    val = parse_u64("3.4") catch err:
        print("InvalidCharacter\n");
    print($"val = {val}\n");

    val = parse_u64("34892");
    print($"val = {val}\n");
```

This program will print these lines to the console:

> ```
> OutOfBounds
> val = 0
> OutOfBounds
> val = 0
> InvalidCharacter
> val = 0
> val = 34892
> ```

### parse_f32

The `parse_f32` function recieves a string which needs to be parsed to an `f32` type. If the string contains characters which are not allowed in a floating point number, e.g. any character that's not `[0..9]`, `-` or `.`, it will throw the `InvalidCharacter` error. If you try to parse a value outside the range of an `f32` it will throw the `OutOfBounds` error.

```ft
use Core.print
use Core.parse

def main():
    f32 val = parse_f32("1e50") catch err:
        print("OutOfBounds\n");
    print($"val = {val}\n");

    val = parse_f32("1e-50") catch err:
        print("OutOfBounds\n");
    print($"val = {val}\n");

    val = parse_f32("3.4:8") catch err:
        print("InvalidCharacter\n");
    print($"val = {val}\n");

    val = parse_f32("-34892.323");
    print($"val = {val}\n");
```

This program will print these lines to the console:

> ```
> OutOfBounds
> val = 0.000000e+
> OutOfBounds
> val = 0.000000e+
> InvalidCharacter
> val = 0.000000e+
> val = -34892.324219
> ```

### parse_f64

The `parse_f64` function recieves a string which needs to be parsed to an `f64` type. If the string contains characters which are not allowed in a floating point number, e.g. any character that's not `[0..9]`, `-` or `.`, it will throw the `InvalidCharacter` error. If you try to parse a value outside the range of an `f64` it will throw the `OutOfBounds` error.

```ft
use Core.print
use Core.parse

def main():
    f64 val = parse_f64("1e400") catch err:
        print("OutOfBounds\n");
    print($"val = {val}\n");

    val = parse_f64("1e-400") catch err:
        print("OutOfBounds\n");
    print($"val = {val}\n");

    val = parse_f64("3.4:8") catch err:
        print("InvalidCharacter\n");
    print($"val = {val}\n");

    val = parse_f64("-34892.323");
    print($"val = {val}\n");
```

This program will print these lines to the console:

> ```
> OutOfBounds
> val = 0.000000000000000e+
> OutOfBounds
> val = 0.000000000000000e+
> InvalidCharacter
> val = 0.000000000000000e+
> val = -34892.322999999996682
> ```
