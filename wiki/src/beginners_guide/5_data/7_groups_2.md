# Groups 2

Until now everything you know about groups is to use them when returning multiple values from a function or when swapping variables. But there is so much more we can do with them. You have learned in the last few chapters that we can define data types, tuples and use multi-types to store multiple values at once. But what if we would want to *modify* multiple values at once? You may have guessed it from the name of this chapter, but we again can use groups for that!

## Grouped Access

Let's start with the most simple form of groups in combination with `data`: The grouped field access. You have already learned that you can write `mydata.field` to access a value stored inside the data variable. To access multiple fields at once, we can use the **grouped access** operator `.()` for that. Here is a small example:

```ft
use Core.print

data MyData:
    i32 x;
    f32 y;
    u64 z;
    MyData(x, y, z);

def main():
    MyData m = MyData(10, 3.5, u64(100));
    i32 x = 0;
    f32 y = 0.0;
    u64 z = 0;
    (x, y, z) = m.(x, y, z);
    print($"(x, y, z) = ({x}, {y}, {z})\n");
```

This program will print this line to the console:

> ```
> (x, y, z) = (10, 3.5, 100)
> ```

It's actually quite simple. Normally we would write `m.x` to access a single field and if we would want to create a group of three accesses we would then write `(m.x, m.y, m.z)`. Just like in math, we can see that the `m.` is common in each case so we end up with `m.(x, y, z)`. This is the absolute minimal syntax we could write to access multiple values of the data at once.

## Grouped Assignment

Just like we can access multiple values with the grouped access operator, we can use the same operator for grouped field assignments on data variables. Just like we would write `m.x = 5` we can express it as a group too:

```ft
use Core.print

data MyData:
    i32 x;
    f32 y;
    u64 z;
    MyData(x, y, z);

def main():
    MyData m = MyData(10, 3.5, u64(100));
    m.(x, y, z) = (3, 3.14, u64(33));
    print($"m.(x, y, z) = ({m.x}, {m.y}, {m.z})\n");
```

This program will print this line to the console:

> ```
> m.(x, y, z) = (3, 3.14, 33)
> ```

Once you understood the concepts of groups all together, it really becomes second nature writing them. Because normally, without groups, the above code would look like this:

```ft
use Core.print

data MyData:
    i32 x;
    f32 y;
    u64 z;
    MyData(x, y, z);

def main():
    MyData m = MyData(10, 3.5, u64(100));
    m.x = 3;
    m.y = 3.14;
    m.z = u64(33);
    print($"m.(x, y, z) = ({m.x}, {m.y}, {m.z})\n");
```

This program will, again, write this line to the console:

> ```
> m.(x, y, z) = (3, 3.14, 33)
> ```

Groups make code both more readable and more consise too. But we are far not done yet.

## Grouped Field Value Swaps

Just like with direct variable values, we can swap values inside of fields too with one another. But for this example we will use multi-types instead because, yes, you can use grouped accesses / assignments on multitypes (and tuples) too:

```ft
use Core.print

def main():
    i32x4 vec4 = (10, 20, 30, 40);
    vec4.(r, g, b, a) = vec4.(b, r, a, g);
    print($"vec4 = {vec4}\n");
```

This program will print this line to the console:

> ```
> vec4 = (30, 10, 40, 20)
> ```

## Vectorization

As you can see, in Flint it is trivial to essentially write vector operations in one line of code. A **vector** operation essentially means that the same operation is applied to multiple different values. Each of those values is called a **scalar**. A sclar operation would be something like `vec4.x += 5` for example, or even a simple addition like `x + y` is considered a scalar operation, because it's an operation applied to two scalar (single) values. Vector operations are pretty common in modern processors, essentially every single processor has support for them. Most modern AMD and Intel CPUs have the capability to perform vector operations up to at least `256 bits`, sometimes even higher.

If you want to know more about this topic you need to wait until the later [SIMD]() chapter. But essentially this means that the CPU has a 256 bit "budget" for vectorized operations, which means it can apply the same operation on 4 `64 bit` values or 8 `32 bit` values at the same time. And these are also the types supported by multi-types: `i64x4` and `i32x8`. So, everything you need to know is that the vectorized code has the potential to run as much as **8x faster** than scalar code. So, if you can, *always* use Flint's multi-types.

But to pull the circle back to grouped operations. Whenever possible, Flint will try to vectorize grouped operations. So, not only are they less to write and easier to read but they also have the potential to be magnitudes faster than scalar operations. Just note that it is *not guaranteed* for a grouped operation to compile down to a vectorized operation, but it *is guaranteed* for multi-types.

## Set-Like Comparisons

The last thing we talk about for now about groups is that groups can be used for set-like comparisons. It is *really* powerful and once you have seen and understood it you may see it being appliccable in many different cases. Stay with me for this one, it will be great. First we need to discuss a simple example to get to the point why set-like comparisons are even needed or wanted, so here is a small example (without using the set-like comparisons):

```ft
use Core.print

def print_cmp(i32 x):
    if x == 1 or x == 2 or x == 3:
        print($"{x} is 1, 2 or 3\n");

    if x != 1 and x != 2 and x != 3:
        print($"{x} is not 1, 2 or 3\n");

def main():
    for i := 0; i < 5; i++:
        print_cmp(i);
```

This program will print these lines to the console:

> ```
> 0 is not 1, 2 or 3
> 1 is 1, 2 or 3
> 2 is 1, 2 or 3
> 3 is 1, 2 or 3
> 4 is not 1, 2 or 3
> ```

The example is not the most useful, but it clearly shows a point. We quite often want to check if a given value is **one of** or **none of** a given set of values. So, it can be quite common to check if a single value is part of a given "set" of values. This is actually much more often used for `enum`s than it is for other types. We will look at an enum example later, but now let's look at how we would write this using the set-like comparisons:

```ft
use Core.print

def print_cmp(i32 x):
    if x == (1, 2, 3):
        print($"{x} is 1, 2 or 3\n");

    if x != (1, 2, 3):
        print($"{x} is not 1, 2 or 3\n");

def main():
    for i := 0; i < 5; i++:
        print_cmp(i);
```

This program will have the same output as the last one. But let's look at what's happening here. We compare one **scalar** type to a single group. Flint has one single special rule about these comparisons. We are allowed to compare a scalar value to a group if and only if the type of the scalar is the same type as **every** value inside the group. A group where all elements have the same type is called a **homogeneous group** in Flint.

Both shown examples actually compile down to the same code under the hood, but the grouped set-like comparison make the intent much clearer and it als reads much nicer. But you cannot just use the `==` and `!=` operators like this, but actually all comparison operations like `<`, `<=`, `>` or `>=` too. So, let's now move on to a smaller example but using enums instead, because it makes a much bigger difference there:

```ft
use Core.print

enum MyEnum:
    VAL1, VAL2, VAL3, VAL4, VAL5;

def main():
    MyEnum me = MyEnum.VAL2;
    if me == MyEnum.VAL1 or me == MyEnum.VAL3 or me == MyEnum.VAL5:
        print("is VAL1, VAL3 or VAL5\n");
    else:
        print("is VAL2 or VAL4\n");

    if me == MyEnum.(VAL1, VAL3, VAL5):
        print("is VAL1, VAL3 or VAL5\n");
    else:
        print("is VAL2 or VAL4\n");
```

This program will print these lines to the console:

> ```
> is VAL2 or VAL4
> is VAL2 or VAL4
> ```

And here you can see the "superpower" of this approach. Because we compare a scalar to a **group**, not a set value, we can use *any* grouped operation in the comparison. The grouped operation `MyEnum.(VAL1, VAL3, VAL5)` looks exaclty like a grouped field access, but for enum values. The resulting group will have the result type of `(MyEnum, MyEnum, MyEnum)`, so it's a homogeneous group and it has the same type as the lhs, namely the type of `MyEnum`. And the length comparison for the grouped and non-grouped comparison will only grow bigger and bigger, the set-like comparison will look simpler the more values it contiains.
