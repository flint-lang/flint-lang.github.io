# Single-line comment

A single line comment can easily be made with the `//` operator.

```ft
// This is a comment
```

# Multi-line comment

A multi-line comment can easily be started with the `/*` operator and ended with the `*/` operator.

```ft
/* Multi-line
comment

*/
```

# FlintDoc comments

To document you code, e.g. what a method is doing, you can use a YAML inspired structure to do so.

```ft
/**
Adds two numbers together

Params:
- x: The first number to add
- y: The second number to add

Returns:
- int: The sum of `a` and `b`

Author:
- Julius Grünberg
*/
def add(int x, y) -> int:
    return x + y;
```
