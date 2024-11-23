# Returning Multiple Values

## Why Multiple Return Values?

Sometimes, a single return value isn’t enough. For instance, a function might need to calculate both the area and perimeter of a rectangle. Flint allows functions to return multiple values at once.

## How to Return Multiple Values
Use parentheses `()` to group multiple values in the return statement and also use parentheses for declaring the return types:

```rs
def calculate_rectangle(int length, int width) -> (int, int):
    int area = length * width;
    int perimeter = 2 * (length + width);
    return (area, perimeter);
```

## Accessing Multiple Return Values
When calling a function with multiple return values, use a group to store them:

```rs
def main():
    (int area, int perimeter) = calculate_rectangle(5, 3);
    print($"Area: {area}, Perimeter: {perimeter}.");
```

## Output:

> Area: 15, Perimeter: 16.

## Important Notes:

1. The types and order of the group must match the function’s return type.
2. While the concept of "groups" is used here, it will be fully explained in a later chapter.

## Encouragement:

You’ve now unlocked the full power of functions in Flint! From organizing logic to handling complex calculations, functions make your programs efficient and reusable. There’s still much to learn, but you’re already building the foundation for advanced concepts.

The journey has just begun—keep experimenting!
