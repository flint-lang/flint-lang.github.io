# read

```rs
use Core.read
```

The `read` module provides several functions to read input from the command line and to read input from the user, like numbers or text edited by the user.

| Function Name | Parameter Types | Return Types | Possible Errors |
|--------------:|:----------------|:------------:|:---------------:|
| `read_str`    | No              | `str`        | No              |
| `read_i32`    | No              | `i32`        | ErrRead         |
| `read_i64`    | No              | `i64`        | ErrRead         |
| `read_u32`    | No              | `u32`        | ErrRead         |
| `read_u64`    | No              | `u64`        | ErrRead         |
| `read_f32`    | No              | `f32`        | ErrRead         |
| `read_f64`    | No              | `f64`        | ErrRead         |

## error sets

These are the error sets this Core module provides.

### ErrRead

This error set does not have a parent error, so it directly and only extends `anyerror` directly. These are the possible values this error could have:

| Error Value    | Description                                      |
|:---------------|:-------------------------------------------------|
| `ReadLines`    | Could not read lines from console                |
| `ParseInt`     | Could not parse text to integer                  |
| `NegativeUint` | Negative input not allowed for unsigned integers |
| `ParseFloat`   | Could not parse text to floating‑point           |

## read_str

The `read_str` function has no parameters and returns a `str` value. It is used to read a whole line from the console. Note that tis function *cannot* return an error, as there is no input parsing or input validation taking place.

```rs
use Core.print
use Core.read

def main():
    str text = read_str();
    print($"entered text: \"{text}\"\n");
```

## read_i32

The `read_i32` function has no parameters and returns a `i32` value. It is used to read `i32` values from the console. It can throw an error if the entered text is not parsable to an signed integer value.

```rs
use Core.print
use Core.read

def main():
    i32 num = read_i32();
    print($"entered i32: {num}\n");
```

## read_i64

The `read_i64` function has no parameters and returns a `i64` value. It is used to read `i64` values from the console. It can throw an error if the entered text is not parsable to an signed integer value.

```rs
use Core.print
use Core.read

def main():
    i64 num = read_i64();
    print($"entered i64: {num}\n");
```

## read_u32

The `read_u32` function has no parameters and returns a `u32` value. It is used to read `u32` values from the console. It can throw an error if the entered text is not parsable to an unsigned integer value.

```rs
use Core.print
use Core.read

def main():
    u32 num = read_u32();
    print($"entered u32: {num}\n");
```

## read_u64

The `read_u64` function has no parameters and returns a `u64` value. It is used to read `u64` values from the console. It can throw an error if the entered text is not parsable to an unsigned integer value.

```rs
use Core.print
use Core.read

def main():
    u64 num = read_u64();
    print($"entered u64: {num}\n");
```

## read_f32

The `read_f32` function has no parameters and returns a `f32` value. It is used to read `f32` values from the console. It can throw an error if the entered text is not parsable to an floating point value.

```rs
use Core.print
use Core.read

def main():
    f32 num = read_f32();
    print($"entered f32: {num}\n");
```

## read_f64

The `read_f64` function has no parameters and returns a `f64` value. It is used to read `f64` values from the console. It can throw an error if the entered text is not parsable to an floating point value.

```rs
use Core.print
use Core.read

def main():
    f64 num = read_f64();
    print($"entered f64: {num}\n");
```

