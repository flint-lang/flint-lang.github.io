# Tuples

Tuples are a really nice concept in general and they exist in pretty much every language. But first, lets talk about what tuples even are and maybe take a closer look at `data` in general.
In Flint, `data` is essentially just a `struct` from C, if you have seen that one before. So when we write

```ft
data Vector2:
    i32 x;
    i32 y;
    Vector2(x, y);
```

we could do something similar in C which would look like this:

```c
typedef struct {
    int x;
    int y;
} Vector2;
```

Under the hood, both Flint's `data` module and C's `struct` are exactly the same. They are just collections of data packed into a struct. So, what are tuples then? Well, tuples are collections of data, packed into a struct too. But with one big difference: They are **anonymous**, meaning that they dont get a _type name_, but when looking at the lowest level, `data` and tuples are actually extremely similar.

## Defining Tuples

Because tuples are anonymous they are not defined like data modules are. They are rather defined inline, like a variable, for example. So here is the basic syntax to define a tuple in Flint:

```ft
def main():
    data<i32, f32, str> tuple = (3, 2.2, "hello!");
```

Do you recognize the `data` keyword? This is the reason i told you earlier that tuples and data are actually pretty much the same thing, but one is named while the other one is not. This connection and the understanding of it is crucial to understand tuples, because otherwise you now would be really confused by the syntax: "Wait, what does the `data` keyword have to do with tuples here?".

And here we have another very nice property of Flint's groups – they enable seemless interoperability between different types! As you can see, the "initializer" for a tuple is actually a group with the same types as the tuple itself. So, the "initializer" of a tuple could also be a grouped field access (d.(a, b, c)` or a group from multiple variables or anything else you can do with groups. As you can see, groups form a whole layer of making syntax easier for a lot of systems.

## Tuple Access

But what about assigning and accessing the specific fields of a tuple? With `data` modules, we can access the fields directly by the name of the field (`v2.x`) but tuples are anonymous, meaning that neither the type itself has a name, nor do the fields.

In Flint, we access the fields of a tuple by its "index". The first field of the tuple above is of type `i32`, the second of type `f32` and the third of type `str`, so we can use the fixed ordering as our accessing syntax right away. But we cannot do `tuple.0`, `tuple.1` etc directly because that would look pretty weird to have an integer literal directly. Here is an example of how to access the single values of a tuple in Flint:

```ft
use Core.print

def main():
    data<i32, f32, str> tuple = (3, 2.2, "hello!");

    i32 first = tuple.$0;
    f32 second = tuple.$1;
    str third = tuple.$2;

    print($"first = {first}\n");
    print($"second = {second}\n");
    print($"third = \"{third}\"\n");
```

This program will print these lines to the console:

> ```
> first = 3
> second = 2.2
> third = "hello!"
> ```

As you can clearly see, we access the elements of the tuple with the `.$N` syntax, where `N` is the index of the element we want to access. Like always for indices, we start at 0 as Flint has zero-based indexing. If we would try to access an element which is out of bounds, like `.$3` in our case we would actually get a compile error:

```ft
def main():
    data<i32, f32, str> tuple = (3, 2.2, "hello!");
    i32 x = tuple.$3;
```

This program will produce this compile error:

> ```
> Parse Error at main.ft:3:19
> └─┬┤E0000│
> 1 │ def main():
> 3 │ »   i32 x = tuple.$3;
> ┌─┴───────────────────┘
> ├─ Out of bounds access on tuple type 'data<i32, f32, str>'
> └─ The tuples last element is '$2'
> ```

## Tuple Assignment

Just like we can access elements from a tuple, we can also assign new values to the elements of a tuple. Here is a simple example of this in action:

```ft
use Core.print

def main():
    data<i32, f32, str> tuple = (3, 2.2, "hello!");

    tuple.$0 = 7;
    tuple.$1 = 4.7;
    tuple.$2 = "yes";

    print($"first = {tuple.$0}\n");
    print($"second = {tuple.$1}\n");
    print($"third = \"{tuple.$2}\"\n");
```

This program prints these lines to the console:

> ```
> first = 7
> second = 4.7
> third = "yes"
> ```

## Grouped accesses and assignments

Just like with "normal" data you can do grouped field accesses and assignments with tuples too. Instead of the field names you need to write the field ids again:

```ft
use Core.print

def main():
    data<i32, f32, str> tuple = (3, 2.2, "hello!");
    tuple.($0, $1, $2) = (7, 4.7, "yes");
    print($"tuple.($0, $1, $2) = ({tuple.$0}, {tuple.$1}, \"{tuple.$2}\")\n");
```

This program prints this line to the console:

> ```
> tuple.($0, $1, $2) = (7, 4.7, "yes")
> ```

## Addition Information

### Multi-Type overlap

Tuples are not allowed to be defined as a type that can be represented with a mutli-type instead. So, this example for example:

```ft
use Core.print

def main():
    data<i32, i32, i32> tuple = (1, 1, 1);
    tuple.($0, $1, $2) = (2, 3, 4);
    print($"tuple.($0, $1, $2) = ({tuple.$0}, {tuple.$1}, {tuple.$2})\n");
```

will throw a this compilation error:

> ```
> Parse Error at main.ft:4:5
> └─┬┤E0000│
> 3 │ def main():
> 4 │ »   data<i32, i32, i32> tuple = (1, 1, 1);
> ┌─┴─────┘
> └─ Cannot create a tuple type which overlaps with a multi-type
> ```

### Returning Tuples

It is not allowed to return a tuple from a function if its the only return type of said function. You need to return a group instead and this is compile-time enforced. The exact reason to why this is required will be clarified in the chapter aboout Flint's error handling. So, this code:

```ft
use Core.print

def get_tuple(i32 a, f32 b, str c) -> data<i32, f32, str>:
    data<i32, f32, str> tuple = (a, b, c);
    return tuple;

def main():
    data<i32, f32, str> tuple = get_tuple(1, 4.7, "hello");
    print($"tuple.($0, $1, $2) = ({tuple.$0}, {tuple.$1}, {tuple.$2})\n");
```

will produce this compile error telling you to use a group of type `(i32, f32, str)` instead as the return type of the function.

> ```
> Parse Error at main.ft:3:39
> └─┬┤E0000│
> 3 │ def get_tuple(i32 a, f32 b, str c) -> data<i32, f32, str>:
> ┌─┴───────────────────────────────────────┘
> ├─ Functions cannot return a tuple type directly.
> └─ If you want to return multiple values, change the return type to '(i32, f32, str)'
> ```

So, instead of trying to return a tuple, you need to return a group instead:

```ft
use Core.print

def get_tuple(i32 a, f32 b, str c) -> (i32, f32, str):
    return (a, b, c);

def main():
    data<i32, f32, str> tuple = get_tuple(1, 4.7, "hello");
    print($"tuple.($0, $1, $2) = ({tuple.$0}, {tuple.$1}, {tuple.$2})\n");
```

annyway. This program will print this line to the console:

> ```
> tuple.($0, $1, $2) = (1, 4.7, hello)
> ```

### Passing Tuples to functions

Tuples can also be passed to functions as any value can:

```ft
use Core.print

def print_tuple(data<i32, f32, str> tuple):
    print($"tuple.(i32, f32, str) = ({tuple.$0}, {tuple.$1}, \"{tuple.$2}\")\n");

def main():
    data<i32, f32, str> tuple = (1, 2.2, "three");
    print_tuple(tuple);
```

This program will print this message to the console:

> ```
> tuple.(i32, f32, str) = (1, 2.2, "three")
> ```

Also, like "normal" data, tuples can be passed to functions as mutable references:

```ft
use Core.print

def change_tuple(mut data<i32, f32, str> tuple):
    tuple.($0, $1, $2) = (2, 3.3, "four");

def main():
    data<i32, f32, str> tuple = (1, 2.2, "three");
    print($"tuple.(i32, f32, str) = ({tuple.$0}, {tuple.$1}, \"{tuple.$2}\")\n");

    change_tuple(tuple);
    print($"tuple.(i32, f32, str) = ({tuple.$0}, {tuple.$1}, \"{tuple.$2}\")\n");
```

This program will print these lines to the console:

> ```
> tuple.(i32, f32, str) = (1, 2.2, "three")
> tuple.(i32, f32, str) = (2, 3.3, "four")
> ```
