# Declaring Data Modules

To define a new `data` module in Flint, we use the `data` keyword. A `data` module consists of **fields** (the pieces of information it holds) and a constructor (in which order to initialize those fields).

## Basic Syntax:

```ft
data Vector2:
    i32 x;
    i32 y;
    Vector2(x, y);
```

As you can see, we start with the `data` keyword, followed with the name of our data module, in this case `Vector2`. Then, we start by defining the **fields** of the data one by one. At the end of the definition we write the **Constructor** of the data, which specifies in which order we need to pass in the field values when creating the data module. This might seem weird for now, but keep going, things will become more clear as we go.

The important thing to note is that we now have a new type at our disposal: `Vector2`. Defining data modules creates new types, so you now can create variables of type `Vector2`, just like we did before with `i32`. Here is a small example:

```ft
data Vector2:
    i32 x;
    i32 y;
    Vector2(x, y);

def main():
    Vector2 v2 = Vector2(10, 20);
```

As you can see, the variable `v2` now is of type `Vector2` and we create it by calling the constructor of the data type with `Vector2(10, 20)`. This constructor sets `x` to `10` and `y` to `20`. But when we try to run this program we cannot see anything in the console, we need a way to print the values the data fields have.

## Field Access

When we want to access a field of our data variable, for example the `x` field of our `v2` varaible we need to do so through a **field access**. There exists a symbol for this very use case: The `.` (dot). It's best if you just look at the example for yourself:

```ft
use Core.print

data Vector2:
    i32 x;
    i32 y;
    Vector2(x, y);

def main():
    Vector2 v2 = Vector2(10, 20);
    print($"v2.x = {v2.x}, v2.y = {v2.y}\n");
```

This program will print this line to the console:

> ```
> v2.x = 10, v2.y = 20
> ```

As you can see, the variable of type `Vector2` now contains two fields of type `i32`, `x` and `y` and we can access and modify themthrough the `.` access.

## Field Assignment

In the next example we will store a new value only on the `x` field of data:

```ft
use Core.print

data Vector2:
    i32 x;
    i32 y;
    Vector2(x, y);

def main():
    Vector2 v2 = Vector2(10, 20);
    print($"v2.x = {v2.x}, v2.y = {v2.y}\n");
    v2.x = 15;
    print($"v2.x = {v2.x}, v2.y = {v2.y}\n");
```

This program will print these lines to the console:

> ```
> v2.x = 10, v2.y = 20
> v2.x = 15, v2.y = 20
> ```

As you can see, we can only modify a single field of data without touching the other fields. But thats not all... now let's talk about how groups can make our life with data easier.

## Grouped Field Access

You already know what a group is, but groups can also be extremely powerful for data manipulation. Grouped field accesses are a new concept of Flint, together with groups. The idea is simple: Access and modify multiple fields of data at the same time. Here is a small example showcasing it:

```ft
use Core.print

data Vector3:
    f32 x;
    f32 y;
    f32 z;
    Vector3(x, y, z);

def main():
    Vector3 v3 = Vector3(1.0, 2.0, 3.0);
    (x, y, z) := v3.(x, y, z);
    print($"(x, y, z) = ({x}, {y}, {z})\n");
```

This program will print this line to the console:

> ```
> (x, y, z) = (1, 2, 3)
> ```

The syntax is pretty easy, actually. First, we say the variable we want to access the fields in: `v3.` and then we open a left paren `(` and within the parenthesis we describe the _names_ of the fields we want to access and we wrap it up with the closing paren `)`. You could see that this line: `v3.(x, y, z)` is actually the same as writing this: `(v3.x, v3.y, v3.z)` but it's much neater to look at and to write. Why should we write `v3.` three times when we only want to access multiple fields of it?

## Grouped Field Assignment

Just like we can access mutliple fields of data at once, we can also assign multiple values of it at the same time. Here is an example of that:

```ft
use Core.print

data Vector3:
    f32 x;
    f32 y;
    f32 z;
    Vector3(x, y, z);

def main():
    Vector3 v3 = Vector3(1.0, 2.0, 3.0);
    print($"v3.(x, y, z) = ({v3.x}, {v3.y}, {v3.z})\n");
    v3.(x, y, z) = v3.(z, x, y);
    print($"v3.(x, y, z) = ({v3.x}, {v3.y}, {v3.z})\n");
```

This program will print these lines to the console:

> ```
> v3.(x, y, z) = (1, 2, 3)
> v3.(x, y, z) = (3, 1, 2)
> ```

As you can see, we did the same thing as we did for variable swaps, but now on data fields. This is only possible through the concoept of groups. A very important thing is that groups themselves have a type. If you would write out the type of the access `v3.(x, y, z)` it would look like this: `(f32, f32, f32)`. As you can see, this looks exactly like the return type of a function when we would return multiple values, enforcing the connection that a function returning multiple values returns a group of values.

But swaps are not all we can do, we can for example calculate multiple values at once, for example incrementing all fields of the vector `v3` by one:

```ft
use Core.print

data Vector3:
    f32 x;
    f32 y;
    f32 z;
    Vector3(x, y, z);

def main():
    Vector3 v3 = Vector3(1.0, 2.0, 3.0);
    print($"v3.(x, y, z) = ({v3.x}, {v3.y}, {v3.z})\n");

    v3.(x, y, z) += (1.0, 1.0, 1.0);
    print($"v3.(x, y, z) = ({v3.x}, {v3.y}, {v3.z})\n");
```

This program will print these lines to the console:

> ```
> v3.(x, y, z) = (1, 2, 3)
> v3.(x, y, z) = (2, 3, 4)
> ```

As you can clearly see, all fields of the variable `v3` have been incremented by one. By combining data with groups you can create very powerful and still compact code.
