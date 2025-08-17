# Primitive Types

Primitive types are Flint's fundamental building blocks for representing data. They are the simplest forms of values you can use in your programs. Flint has the following primitive types:

1. `i32`
   Represents whole numbers, both positive and negative. Use `i32` for counting, indexing, or whenever you need discrete values.

```ft
def main():
    i32 x = 42; // A positive integer
    i32 y = -15; // A negative integer
    i32 z = 0; // Zero is also an integer
```

2. `u32`
   Represents whole numbers, but only positive ones. Use `u32` for IDs.

```ft
def main():
    u32 id_1 = 1;
    u32 id_0 = 0;
```

3. `f32`
   Represents floating-point numbers (decimal numbers). Use `f32` for measurements, precise calculations, or any value that requires a fractional component.

```ft
def main():
    f32 pi = 3.14; // Approximation of Pi
    f32 zero_kelvin = -273.15; // Negative floating point values are valid
    f32 zero = 0.0; // Zero with a decimal
```

4. `str`
   Represents a sequence of characters or text, as already described in the printing chapter. Use `str` for names, messages, or any textual data. Strings must be enclosed in double quotes (`"`).

```ft
def main():
    str name = "Flint"; // A simple string
    str empty = ""; // An empty string
    str greeting = "Hello, World!"; // A common example
```

These types are the foundation of Flint's data handling. As you write more complex programs, you'll combine them in creative ways to represent and manipulate information. But these are not the only primitive types there are available for Flint, they are just the most frequently used ones.

## Bit-Width

Now lets talk a bit about bit-width. You surely have seen the number after `i`, `u` and `f`. This is the **bit-width**. Computers work with bits, in this case it means that the integer and floating point types are 32 bits long. Here is a full list of all primitive types in Flint and their minimum and maximum values:

| Type  | Description                  |         Min         |         Max         | Precision      |
| :---: | ---------------------------- | :-----------------: | :-----------------: | -------------- |
| `u8`  | unsigned 8 bit integer       |         `0`         |        `255`        | Whole numbers  |
| `u32` | unsigned 32 bit integer      |         `0`         |   `4,294,967,295`   | Whole numbers  |
| `u64` | unsigned 64 bit integer      |         `0`         |  ≈ `1.844 × 10^19`  | Whole numbers  |
| `i32` | signed 32 bit integer        |  `-2,147,486,648`   |   `2,147,486,647`   | Whole numbers  |
| `i64` | signed 64 bit integer        | ≈ `-1.844 × 10^19`  |  ≈ `1.844 × 10^19`  | Whole numbers  |
| `f32` | 32 bit floating point number | ≈ `±1.175 × 10^-38` | ≈ `±1.701 × 10^38`  | ≈ 6 - 9 digits |
| `f64` | 64 bit floating point number |  ≈ `±1 × 10^-383`   | ≈ `±9.999 × 10^384` | ≈ 16 digits    |
