# Default Values

<div class="warning">

Default values do not work yet.

While default values are able to be parsed in the data definition itself, the constructor of data cannot be called with the `_` operator to create a default instance of the type.

</div>

Sometimes, you may want a field to have a **default value**. In Flint, this is done by assigning a value to the field directly in its declaration.

```rs
data MyData:
    i32 x = 5;
    i32 y;
    MyData(x, y);
```

When instantiating this data module, you can use `_` to signify using the default value for a field. The `_` operator is **only** used in *unused* or *default* contexts, nowhere else. So, if you see a single `_` in Flint you can **always** assume that either something is unused or set to a default.

```rs
use Core.print

data MyData:
    i32 x = 5;
    i32 y;
    MyData(x, y);

def main():
    MyData d = MyData(_, 20); // x uses the default value of 5
    print($"d.x = {d.x}, d.y = {d.y}\n");
```

This program will print this line to the console:

> d.(x, y) = (5, 20)

If **all** fields of a given data type have default values set the constructor of the data type can be called with a single `_` operator to singify to **set every field to its default value**. But, note that this only works if **every** field in the given data type has a default value set. If one of them has no default value set this will fail.

```rs
use Core.print

data MyData:
    i32 x = 5;
    i32 y = 7;
    MyData(x, y);

def main():
    MyData d = MyData(_);
    print($"d.(x, y) = ({d.x}, {d.y})\n");
```

This program will print this line to the console:

> d.(x, y) = (5, 7)

1. Default values simplify initialization but are optional.
2. If a field doesn’t have a default value, using `_` will result in a **compiler error**
