# print

```rs
use Core.print
```

The `print` core module provides several print functions. Here are all the print functions this module provides. There exist *a lot* of builtin print overloads for the print function.

| Parameter Types | Return Types | Can Throw? |
|:---------------:|:------------:|:----------:|
| `str`           | `void`       | No         |
| `i32`           | `void`       | No         |
| `i64`           | `void`       | No         |
| `u32`           | `void`       | No         |
| `u64`           | `void`       | No         |
| `f32`           | `void`       | No         |
| `f64`           | `void`       | No         |
| `u8`            | `void`       | No         |
| `bool`          | `void`       | No         |

Note that none of the print functions prints a new line after the print. This could be important when printing values in a loop, for example, because calling a "native" print function like `print(i32)` is generally speaking faster than calling the `print(str)` function with an interpolated string as argument, as string casting + concatenation takes more time than just calling the specialized print functions one after another. So, while string interpolation is **much** more ergonomic for the programmer, its is also a bit slower generally speaking.

The `print(str)` function was used throughout this wiki until now. Every string interpolation evaluates to a string value, so this is the function we have called *exclusively* thus far, to make printing not as overwhelming.

