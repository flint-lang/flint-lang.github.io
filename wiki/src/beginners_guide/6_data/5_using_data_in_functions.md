# Using Data in Functions

Data modules can be passed to and returned from functions, enabling you to manipulate them easily.

## Example: Passing Data to Functions

```rs
def print_point(Point p):
    print($"Point(x: {p.x}, y: {p.y})");

def main():
    Point p = Point(3, 4);
    print_point(p); // Outputs: Point(x: 3, y: 4)
```

## Example: Returning Data from Functions

```rs
def create_point(int x, int y) -> Point:
    return Point(x, y);

def main():
    Point p = create_point(5, 7);
    print($"Created Point: x={p.x}, y={p.y}");
```

By using functions with data, you can create and manipulate complex structures easily.

## Conclusion

Data modules are the foundation of Flint’s design, allowing you to create, structure, and manage information effectively. From default values to nested structures, they provide a flexible yet powerful way to organize your program’s core logic. You’ve taken your first step into Flint’s data-centric world—congratulations!
