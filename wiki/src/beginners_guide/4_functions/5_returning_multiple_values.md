# Returning Multiple Values

Sometimes, a single return value isn’t enough. For instance, a function might need to calculate both the area and perimeter of a rectangle. Flint allows functions to return multiple values at once, without limiting the number of maximum returned values.

## How to Return Multiple Values

To return multiple values we use parentheses `()` to group multiple values in the return statement and also use parentheses for declaring the return types:

```ft
def calculate_rectangle(i32 length, i32 width) -> (i32, i32):
    i32 area = length * width;
    i32 perimeter = 2 * (length + width);
    return (area, perimeter);
```

As you can see, this function now returns a `group`. Groups are a special concept of Flint, but you will learn about them more in the next chapter. Its important that you separate the values you want to return with commas inside the parenthesis like shown above.

## Accessing Multiple Return Values

To recieve the values from a function which returns multiple values we also need to use a group to assign them.

```ft
use Core.print

def calculate_rectangle(i32 length, i32 width) -> (i32, i32):
    i32 area = length * width;
    i32 perimeter = 2 * (length + width);
    return (area, perimeter);

def main():
    (area, perimeter) := calculate_rectangle(5, 3);
    print($"Area: {area}, Perimeter: {perimeter}\n");
```

This program will print this line to the console:

> ```
> Area: 15, Perimeter: 16
> ```

As you can see, we can declare two variables at once using inferred typing (`:=`) from the call `calculate_rectangle`. Both `area` and `perimeter` are of type `i32` now and then we can print their values.

## Important Note

The types and order of the group must match the function’s return type.
