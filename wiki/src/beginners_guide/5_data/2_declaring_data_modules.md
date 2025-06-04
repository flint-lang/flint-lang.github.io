# Declaring Data Modules

To define a new data module in Flint, use the data keyword. A data module consists of fields (the pieces of information it holds) and a constructor (which initializes those fields).

## Basic Syntax:

```rs
data MyData:
    int x;
    int y;
    MyData(x, y);
```

## What is a Constructor?

The constructor is the part of the data declaration that defines how to instantiate the data module. It must include all the fields defined in the data module.

*Key Points:*

1. The constructor’s **order** determines how fields are initialized:
    - In the example, x must be assigned first, then y.
2. The **order of fields** inside the module does not matter but should align with the constructor for clarity.
3. Constructors are required for all data modules.

## Example: Creating an Instance

```rs
def main():
    MyData d = MyData(10, 20);
    print($"d.x: {d.x}, d.y: {d.y}");
    // Outputs: d.x: 10, d.y: 20
```
