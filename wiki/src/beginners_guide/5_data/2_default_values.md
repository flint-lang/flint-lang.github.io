# Default Values

Sometimes, you may want a field to have a **default value**. In Flint, there are two cases where we refer to "default" values. First, default values of **fields** and then second, default values of a given **type**. Many types in Flint have default-values, for example all primitive integer types (`i32`, `u32`, `u16`, `i64` etc) have the default-value of `0` or the `str` type has the default value `""` for example.

When we talk about the default-values of **types** we talk about **Default-Construction**. A type which has a default-value is **default-constructible**.  These two concepts go hand-in-hand.

## Default-Construction

Default-construction refers to the concept of constructors, where the constructor applies default-values. We can, for example, define a data component like this:

```ft
data MyData:
    i32 x = 5;
    i32 y;
```

and here the field `x` has an explicit default-value set to it. So, when we call the constructor, we can just pass the field of `y` to the constructor and leave out `x` entirely:

```ft
use Core.print

data MyData:
    i32 x = 5;
    i32 y;

def main():
    MyData d = MyData{ .y = 20 }; // x uses the default value of 5
    print($"d.(x, y) = ({d.x}, {d.y})\n");
```

This program will print this line to the console:

> ```
> d.(x, y) = (5, 20)
> ```

As you can see, we did not specify with which value `x` is constructed, but since we defined it in the definition of the data component, Flint knows what the default-value of `x` should be. And now to the default-constructibility mentioned earlier. We could even omit the `.y = 20` construction as well:

```ft
use Core.print

data MyData:
    i32 x = 5;
    i32 y;

def main():
    MyData d = MyData{};
    print($"d.(x, y) = ({d.x}, {d.y})\n");
```

This program will print this line to the console:

> ```
> d.(x, y) = (5, 0)
> ```

As you can see, it is *not* required to provide default values to all fields of a data component definition to make it default-constructible. If you see a constructor like `T{}` it *always* means that we try to default-construct a value of type `T`. A data type is default-constructible if *all* its fields are default-constructible too. 

## Default-Operator

The default-operator `_` can be used in quite a few places in Flint. You have already seen it when discarding return-values of functions and when discarding iterator or elements in the enhanced for loop. In both cases, the `_` operator was used in a somewhat-special way, as the lhs of an assignment or in other contexts where we don't expect "normal" expressions. However, the `_` operator can also be used *everywhere* where you can write an expression.

When the default-operator `_` is used as an expression, it means **default-construct a value of the type expected for this expression**. This means that we could write an initializer like this:

```ft
use Core.print

data MyData:
    i32 x = 5;
    i32 y;

def main():
    MyData d = MyData{_, _};
    print($"d.(x, y) = ({d.x}, {d.y})\n");
```

This program will print this line to the console:

> ```
> d.(x, y) = (0, 0)
> ```

As you can see, both `x` and `y` were initialized to be `0`, even though we wrote `i32 x = 5;` in the `MyData` definition. As described above, the default-operator `_` default-constructs a value of a certain type, so in the above example we actually default-construct two `i32` values and then pass them to the constructor, so the above example would be equal to writing `MyData{0, 0}` as `0` is the default-value of the type `i32`.

If we, however, would write `MyData d = _;` then it would be equal to writing `MyData d = MyData{};` and this would, as we already discussed, result in `x` being initialized as `5`.

I hope the difference between default-construction and the default-operator is clear. The default-operator tries to default-construct a value **of the expected expressions type**.
