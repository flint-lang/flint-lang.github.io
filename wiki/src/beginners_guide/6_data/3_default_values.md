# Default Values

Sometimes, you may want a field to have a **default value**. In Flint, this is done by assigning a value to the field directly in its declaration.

## Example: Default Values

```rs
data MyData:
    int x = 5;
    int y;
    MyData(x, y);
```

When instantiating this data module, you can use `_` to signify using the default value for a field:

```rs
def main():
    MyData d = MyData(_, 20); // x uses the default value of 5
    print($"d.x: {d.x}, d.y: {d.y}");
    // Outputs: d.x: 5, d.y: 20
```

## Key Notes:

1. Default values simplify initialization but are optional.
2. If a field doesn’t have a default value, using `_` will result in a **compiler error**:
```
MyData d = MyData(_, _); // Error: y has no default value
```
