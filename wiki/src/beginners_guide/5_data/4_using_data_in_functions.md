# Using Data in Functions

Data modules can be passed to and returned from functions, enabling you to manipulate them easily.

```rs
use Core.print

data Point:
    i32 x;
    i32 y;
    Point(x, y);

def print_point(Point p):
    print($"Point(x: {p.x}, y: {p.y})\n");

def main():
    Point p = Point(3, 4);
    print_point(p);
```

This program will print this line to the console:

> ```
> Point(x: 3, y: 4)
> ```

## Mutability and Immutability

Okay, but what if we want to modify the point in a function? Lets look at an example:

```rs
use Core.print

data Point:
    i32 x;
    i32 y;
    Point(x, y);

def increment_by(Point p, i32 value):
    p.(x, y) += (value, value);

def main():
    Point p = Point(3, 4);
    increment_by(p, 3);
    print($"Point(x: {p.x}, y: {p.y})\n");
```

If you try to compile this program you will actually get a compile error:

> ```
> Parse Error at main.ft:9:5
>  -- Variable 'p' is marked as 'const' and cannot be modified!
> ```

But why is that? For this to explain we actually need to talk about **mutability** for a bit. Mutability is the ability to mutate (change) variables. Up until now this has not been a problem yet, because Flint actually has clear mutability rules:

- Local variables declared within a scope are always **mutable** except explicitely made immutable
- Function parameters are always **immutable** except explicitely made mutable

Flint has two keywords for this very reason: `mut` and `const`. You can use `const` when declaring a variable in a scope to make the variable constant, thus not-changable after its declaration and you can use `mut` to make parameters of functions explicitely mutable. Note that putting `const` in front of a function parameter has no effect, as its const annyway, same as putting `mut` in front of a variable declaration, as variables are mutable annyway.

So, to fix our little compile error we need to change the signature of our function a bit:

```rs
use Core.print

data Point:
    i32 x;
    i32 y;
    Point(x, y);

def increment_by(mut Point p, i32 value):
    p.(x, y) += (value, value);

def main():
    Point p = Point(3, 4);
    increment_by(p, 3);
    print($"Point(x: {p.x}, y: {p.y})\n");
```

This program will print this line to the console:

> ```
> Point(x: 6, y: 7)
> ```

As you can see, the functions signature of the `increment_by` function now explicitely states that its parameter is a mutable one. This means that we can only pass in mutable `Point` variables to it when calling it. So, this example:

```rs
use Core.print

data Point:
    i32 x;
    i32 y;
    Point(x, y);

def increment_by(mut Point p, i32 value):
    p.(x, y) += (value, value);

def main():
    const Point p = Point(3, 4);
    increment_by(p, 3);
    print($"Point(x: {p.x}, y: {p.y})\n");
```

will not compile again. Because now we have declared `p` to be immutable, but we try to pass it to to the call `increment_by` which expects a mutable `Point` argument, so we have a type mismatch here, because when we made `p` immutable it would be wrong if it could be modified by a function. We get this compile error:

> ```
> Parse Error at main.ft:13:18
>  -- Variable 'p' is marked as 'const' and cannot be modified!
> ```

## Returning Data from Functions

<div class="warning">

Returning the constructed data directly does not work yet.

When you write
```rs
def create_point(i32 x, i32 y) -> Point:
    return Point(x, y);
```
what Flint actually does under the hood will lead to a compilation error, as the code generation phase will fail. This is because a constructor is actually just a group under the hood, and the "element" values of data are stored in the Point variable directly. This means that the function tries to return a `(i32, i32)` instead of a `Point`, essentailly. It's not a mistake of Flint's type system or anything similar, it's just how the data declaration works at the moment, which is a bit flawed. That's also the reason why nested data constructors cannot be written directly into the constructor of the data which contains them.

The below example will work perfectly fine, as we store the `Point` in a varaible first, before returning it.

</div>

You can also return data from functions, for example when creating them inside the function.

```rs
use Core.print

data Point:
    i32 x;
    i32 y;
    Point(x, y);

def create_point(i32 x, i32 y) -> Point:
    Point p = Point(x, y);
    return p;

def main():
    Point p = create_point(5, 7);
    print($"Point(x: {p.x}, y: {p.y})\n");
```

This program will print this line to the console:

> ```
> Point(x: 5, y: 7)
> ```

By using functions with data, you can create and manipulate complex structures easily.
