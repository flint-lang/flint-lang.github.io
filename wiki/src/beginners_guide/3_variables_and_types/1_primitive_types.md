# Primitive Types

Primitive types are Flint's fundamental building blocks for representing data. They are the simplest forms of values you can use in your programs. Flint has the following primitive types:

1. `int`
Represents whole numbers, both positive and negative. Use int for counting, indexing, or whenever you need discrete values.
```rs
int x = 42; // A positive integer
int y = -15; // A negative integer
int z = 0; // Zero is also an integer
```
2. `flint`
Represents floating-point numbers (decimal numbers). Use flint for measurements, precise calculations, or any value that requires a fractional component.
```rs
flint pi = 3.14; // Approximation of π
flint temperature = -273.15; // Negative decimal values are valid
flint zero = 0.0; // Zero with a decimal
```
3. `str`
Represents a sequence of characters or text. Use str for names, messages, or any textual data. Strings must be enclosed in double quotes (").
```rs
str name = "Flint"; // A simple string
str empty = ""; // An empty string
str greeting = "Hello, World!"; // A common example
```

These types are the foundation of Flint's data handling. As you write more complex programs, you'll combine them in creative ways to represent and manipulate information.
