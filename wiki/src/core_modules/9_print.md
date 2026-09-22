# print

```ft
use Core.print
```

The `print` core module provides several `print` function overloads. Here are all the print functions this module provides. There exist _a lot_ of builtin print overloads for the print function.

```ft
def print(u8 value);
def print(i8 value);
def print(u16 value);
def print(i16 value);
def print(u32 value);
def print(i32 value);
def print(u64 value);
def print(i64 value);
def print(f32 value);
def print(f64 value);
def print(str value);
def print(bool value);
```

Note that none of the print functions prints a new line after the print. This could be important when printing values in a loop, for example, because calling a "native" print function like `print(i32)` is generally speaking faster than calling the `print(str)` function with an interpolated string as argument, as string casting + concatenation takes more time than just calling the specialized print functions one after another. So, while string interpolation is **much** more ergonomic for the programmer, its is also a bit slower generally speaking.

The `print(str)` function was used throughout this wiki until now. Every string interpolation evaluates to a string value, so this is the function we have called _exclusively_ thus far, to make printing not as overwhelming.
