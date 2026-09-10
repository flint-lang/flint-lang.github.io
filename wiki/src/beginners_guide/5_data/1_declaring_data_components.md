# Declaring Data Components

To define a new `data` component in Flint, we use the `data` keyword. A `data` component consists of **fields**, being the pieces of information it holds.

## Basic Syntax:

```ft
data Vector2:
    i32 x;
    i32 y;
```

As you can see, we start with the `data` keyword, followed with the name of our data component, in this case `Vector2`. Then we define the **fields** of the data one by one, in this case `x` and `y`.

The important thing to note is that we now have a new type at our disposal: `Vector2`. Defining data components creates new types, so you now can create variables of type `Vector2`, just like we did before with `i32`. Here is a small example:

```ft
data Vector2:
    i32 x;
    i32 y;

def main():
    Vector2 v2 = Vector2{10, 20};
```

As you can see, the variable `v2` now is of type `Vector2`. Here we can see a new concept: The **Constructor**. A constructor in Flint **always** is written as the type followed by braces, so in our case `Vector2{...}`. Before continuing on with any other concept, we need to talk a bit more about constructors in general.

## Constructors

As stated above, a constructor is always denoted with the braces. There are two forms of constructors: Constructors using *named field construction* and constructors using *positional construction*.

### Positional Construction

The above example is an example of *positional construction*. We defined the `Vector2` type so that `x` comes before `y`, this means that when we construct a value of type `Vector2` and we write `Vector2{10, 20}` then `x` is set to `10` and `y` is set to `20`. This is the easier way to construct a type, but as you can see, when constructing the value you need to know which field is associated with which position. For small types like the `Vector2` this is not a problem, but imagine having 10 fields, it would get pretty confusing pretty quickly.

### Named Field Construction

This is where named field construction comes into play. Instead of relying on the *position* of fields in the constructor, we can explicitely name them. For example instead of writing `Vector2{10, 20}` we can write

```ft
def main():
    Vector2 v2 = Vector2{ .x = 10, .y = 20 };
```

here we explicitely name the fields we want to initialize. If you are familiar with C, this is very similar to [Designated Initializers](https://www.geeksforgeeks.org/c/designated-initializers-c/) introduced in C99. You can also leave some fields out when initializing values, but this will be introduced later. We will use positional construction most of times throughout the rest of the Wiki, but note that you always are able to initialize values using the field names too.

## Field Access

When we want to access a field of our data variable, for example the `x` field of our `v2` varaible we need to do so through a **field access**. There exists a symbol for this very use case: The `.` (dot). It's best if you just look at the example for yourself:

```ft
use Core.print

data Vector2:
    i32 x;
    i32 y;

def main():
    Vector2 v2 = Vector2{10, 20};
    print($"v2.x = {v2.x}, v2.y = {v2.y}\n");
```

This program will print this line to the console:

> ```
> v2.x = 10, v2.y = 20
> ```

As you can see, the variable of type `Vector2` now contains two fields of type `i32`, `x` and `y` and we can access and modify them through the `.` operator.

## Field Assignment

In the next example we will store a new value only on the `x` field of data:

```ft
use Core.print

data Vector2:
    i32 x;
    i32 y;

def main():
    Vector2 v2 = Vector2{10, 20};
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

You already know what a group is, but groups can also be extremely powerful for data manipulation. Grouped field accesses are a new concept of Flint (swizzling exists, but it does only work on vectors in most other languages), it directly emerged from the group design. The idea is simple: Access and modify multiple fields of data at the same time. Here is a small example showcasing it:

```ft
use Core.print

data Vector3:
    f32 x;
    f32 y;
    f32 z;

def main():
    Vector3 v3 = Vector3{1.0, 2.0, 3.0};
    (x, y, z) := v3.(x, y, z);
    print($"(x, y, z) = ({x}, {y}, {z})\n");
```

This program will print this line to the console:

> ```
> (x, y, z) = (1.0, 2.0, 3.0)
> ```

We first say the variable we want to access the fields in: `v3.` and then we open a left paren `(` and within the parenthesis we describe the *names* of the fields we want to access and we wrap it up with the closing paren `)`. You could see that this line: `v3.(x, y, z)` is actually the same as writing this: `(v3.x, v3.y, v3.z)` but it's much neater to look at and to write. Why should we write `v3.` three times when we only want to access multiple fields of it?

## Grouped Field Assignment

Just like we can access mutliple fields of data at once, we can also assign multiple values of it at the same time. Here is an example of that:

```ft
use Core.print

data Vector3:
    f32 x;
    f32 y;
    f32 z;

def main():
    Vector3 v3 = Vector3{1.0, 2.0, 3.0};
    print($"v3.(x, y, z) = ({v3.x}, {v3.y}, {v3.z})\n");
    v3.(x, y, z) = v3.(z, x, y);
    print($"v3.(x, y, z) = ({v3.x}, {v3.y}, {v3.z})\n");
```

This program will print these lines to the console:

> ```
> v3.(x, y, z) = (1.0, 2.0, 3.0)
> v3.(x, y, z) = (3.0, 1.0, 2.0)
> ```

As you can see, we did the same thing as we did for variable swaps, but now on data fields. This is only possible through the concept of groups. A very important thing is that groups themselves have a type. If you would write out the type of the access `v3.(x, y, z)` it would look like this: `(f32, f32, f32)`. As you can see, this looks exactly like the return type of a function when we would return multiple values, enforcing the connection that a function returning multiple values returns a group of values.

But swaps are not all we can do, we can for example calculate multiple values at once, for example incrementing all fields of the vector `v3` by one:

```ft
use Core.print

data Vector3:
    f32 x;
    f32 y;
    f32 z;

def main():
    Vector3 v3 = Vector3{1.0, 2.0, 3.0};
    print($"v3.(x, y, z) = ({v3.x}, {v3.y}, {v3.z})\n");

    v3.(x, y, z) += (1.0, 1.0, 1.0);
    print($"v3.(x, y, z) = ({v3.x}, {v3.y}, {v3.z})\n");
```

This program will print these lines to the console:

> ```
> v3.(x, y, z) = (1.0, 2.0, 3.0)
> v3.(x, y, z) = (2.0, 3.0, 4.0)
> ```

As you can clearly see, all fields of the variable `v3` have been incremented by one. By combining data with groups you can create very powerful and still compact code.
