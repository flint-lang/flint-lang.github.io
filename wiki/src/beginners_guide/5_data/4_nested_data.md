# Nested Data

Data modules can include other data modules as fields. This allows you to create nested structures, which are common in real-world programming.

## Example: Nested Data

```rs
data Point:
    int x;
    int y;
    Point(x, y);

data Rectangle:
    Point top_left;
    Point bottom_right;
    Rectangle(top_left, bottom_right);
```

## Usage:

```rs
def main():
    Point p1 = Point(0, 0);
    Point p2 = Point(10, 10);
    Rectangle rect = Rectangle(p1, p2);
    print($"rect.topLeft.x: {rect.topLeft.x}");
    // Outputs: rect.topLeft.x: 0
```

## Circular References?

Flint does not allow a data module to reference itself directly or indirectly like showcased below:

```rs
data Node:
    int value;
    Node next;
    Node(value, next);
```
While this may seem restrictive, it prevents issues like infinite recursion or memory management problems. The explicit explaination of to why this is not directly possible will be explained in a later chapter. For now, focus on the fact that it is not possible.

## Hint:

Flint can handle circular references with the help of the **optional type (`Opt`)**. These convert a reference to a wek reference in circular context's, thus enabling the use of data in of itself, for example for **linked lists**.
