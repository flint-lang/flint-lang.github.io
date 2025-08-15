# Nested Data

Data modules can include other data modules as fields. This allows you to create nested structures, which are common in real-world programming. Here is an example of this concept in action:

```rs
use Core.print

data Point:
    i32 x;
    i32 y;
    Point(x, y);

data Rectangle:
    Point top_left;
    Point bottom_right;
    Rectangle(top_left, bottom_right);

def main():
    Point p1 = Point(0, 0);
    Point p2 = Point(10, 10);
    Rectangle rect = Rectangle(p1, p2);
    print($"rect.top_left.(x, y) = ({rect.top_left.x}, {rect.top_left.y})\n");
    print($"rect.bottom_right.(x, y) = ({rect.bottom_right.x}, {rect.bottom_right.y})\n");
```

This program will print these lines to the console:

> ```
> rect.top_left.(x, y) = (0, 0)
> rect.bottom_right.(x, y) = (10, 10)
> ```

Note that storing the `Point` variables in the `rect` variable through its constructor creates _copies_ of the points. In other languages this would need to be done manually, but in Flint its automatic. So, when changing `p1` and `p2` after the creation of `rect`, the `top_left` and `bottom_right` fields will not be changed:

```rs
use Core.print

data Point:
    i32 x;
    i32 y;
    Point(x, y);

data Rectangle:
    Point top_left;
    Point bottom_right;
    Rectangle(top_left, bottom_right);

def main():
    Point p1 = Point(0, 0);
    Point p2 = Point(10, 10);
    Rectangle rect = Rectangle(p1, p2);

    print($"p1.(x, y) = ({p1.x}, {p1.y})\n");
    print($"p2.(x, y) = ({p2.x}, {p2.y})\n");
    print($"rect.top_left.(x, y) = ({rect.top_left.x}, {rect.top_left.y})\n");
    print($"rect.bottom_right.(x, y) = ({rect.bottom_right.x}, {rect.bottom_right.y})\n");

    print("\n");
    p1.(x, y) = (4, 5);
    p2.(x, y) = (22, 33);

    print($"p1.(x, y) = ({p1.x}, {p1.y})\n");
    print($"p2.(x, y) = ({p2.x}, {p2.y})\n");
    print($"rect.top_left.(x, y) = ({rect.top_left.x}, {rect.top_left.y})\n");
    print($"rect.bottom_right.(x, y) = ({rect.bottom_right.x}, {rect.bottom_right.y})\n");
```

This program will print these lines to the console:

> ```
> p1.(x, y) = (0, 0)
> p2.(x, y) = (10, 10)
> rect.top_left.(x, y) = (0, 0)
> rect.bottom_right.(x, y) = (10, 10)
>
> p1.(x, y) = (4, 5)
> p2.(x, y) = (22, 33)
> rect.top_left.(x, y) = (0, 0)
> rect.bottom_right.(x, y) = (10, 10)
> ```

## What about Circular References?

<div class="warning">

The below example actually compiles, but its impossible to run usefully.

Data is actually allowed to contain itself, but its impossible to initialize, as Flint has noo concept of **nullpointers** or **null** like other languages have. Flint has its optionals `T?` instead, but you will learn about them in a much later chapter. For now, just be aware that it *is* possible to create circular data, but you cannot initialize it.

</div>

Flint does not allow a data module to reference itself directly or indirectly like showcased below:

```rs
data Node:
    i32 value;
    Node next;
    Node(value, next);

def main():
    return;
```

While this may seem restrictive, it is pretty easy explained why this does not work: If you try to initialize a new variable of type `Node` you need to provide both its fields for the initializer. The `value` is fine, you can just pass in a literal, but what about the second field, `next`? To create a new variable of type `Node` you need an already existent variable of the same type to pass into, and thats impossible.

## Hint:

Flint can handle circular references with the help of the **optional type (`?`)**. These convert a reference to a wek reference in circular context's, thus enabling the use of data in of itself, for example for **linked lists**.
