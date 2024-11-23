# String Interpolation

In Flint, you can embed variables or expressions directly into strings using string interpolation. This makes constructing strings with dynamic content both easy and readable. To interpolate, use the $"{...}" syntax.

**Here’s an example:**

```rs
str name = "Flint";
int age = 1;
print($"Hello, my name is {name} and I am {age} years old.");
```

Output:

> Hello, my name is Flint and I am 1 years old.

You can interpolate any variable or expression into a string:

```rw
flint pi = 3.14;
print($"The value of pi is approximately {pi}."); // Insert a flint value
print($"2 + 2 equals {2 + 2}."); // Insert an arithmetic expression
```

**Remember:**

The print function only takes a single argument of type str.

Use string interpolation whenever you need to build strings dynamically—it’s clean, concise, and avoids manual concatenation.

---

Now that you understand Flint’s primitive types, implicit typing, and string interpolation, you’re ready to explore how to work with arrays and collections of data!
