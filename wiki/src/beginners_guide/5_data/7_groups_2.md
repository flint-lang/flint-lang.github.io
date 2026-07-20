# Groups 2

Until now everything you know about groups is to use them when returning multiple values from a function, when swapping variables and when accessing or assigning multiple values of data and tuples at the same time, but there is still a lot more to learn about them than just this.

## Vectorization

In Flint it is trivial to essentially write vector operations in one line of code. Through the use of groups we can easily express that some things, like multiplying all values of a data structure, need to happen at the same time.
A **vector** operation essentially means that the same operation is applied to multiple different values. Each of those values is called a **scalar**. A sclar operation would be something like `vec4.x += 5` for example, or even a simple addition like `x + y` is considered a scalar operation, because it's an operation applied to two scalar (single) values. Vector operations are pretty common in modern processors, essentially every single processor has support for them. Most modern CPUs have the capability to perform vector operations up to at least `256 bits`, sometimes even higher.

If you want to know more about this topic, it is recommended to research terms like **SIMD** or **Vectorization** (as noted in the last chapter). But essentially this means that the CPU has a 256 bit "budget" for vectorized operations, which means it can apply the same operation on 4 `64 bit` values or 8 `32 bit` values at the same time. And these are also the types supported by vectors: `i64x4` and `i32x8`. So, everything you need to know is that the vectorized code has the potential to run as much as **8x faster** than scalar code. So, if you can, *always* use vectors.

But to pull the circle back to grouped operations. Whenever possible, Flint will try to vectorize grouped operations. So, not only are they less to write and easier to read (compared to multiple lines of scalar operations) but they also have the potential to be magnitudes faster than scalar operations. Just note that it is *not guaranteed* for a grouped operation to compile down to a vectorized operation, unlike vector types where it *is guaranteed*.

## Splatting

Splatting is the act of expanding a **scalar** value to a **homogeneous group of size `N`**. A [Splat](https://releases.llvm.org/20.1.0/docs/Lexicon.html) refers to a vector of identical scalar elements, and the act of creating such vector is called splatting. In Flint, however, this is not only limited to vectors but can be used more broadly for groups in general. It is pretty simple in action.

```ft
use Core.print

def main():
	i32x3 vec3 = (10, 20, 30);
	print($"vec3 = {vec3}\n");
	vec3 *= 2;
	vec3 *= i32(2);
	print($"vec3 = {vec3}\n");
```

This program will print these lines to the console:

> ```
> vec3 = (10, 20, 30)
> vec3 = (40, 80, 120)
> ```

Here, the scalar value `2` is expanded to a `(i32, i32, i32)` group where every element of the group holds the element of `2`, so a group like `(2, 2, 2)` is created.

## Set-Like Comparisons

The last thing we talk about for now about groups is that groups can be used for set-like comparisons. It is *really* powerful and once you have seen and understood it. You may see it being appliccable in many different cases. We first need to discuss a simple example to get to the point why set-like comparisons are even needed or wanted, so here is a small example as a baseline (without using the set-like comparisons):

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

This program will have the same output as the last one. But lets look at what's happening here. We compare one **scalar** value with a group. Flint has one single special rule about these comparisons. We are allowed to compare a scalar value to a group if and only if the type of the scalar is the same type as **every** value inside the group. A group where all elements have the same type is called a **homogeneous group** in Flint.

Both shown examples compile down to the same code under the hood, but the grouped set-like comparison make the intent much clearer and it also reads much nicer. You cannot only use the `==` and `!=` operators like this, but all comparison operations like `<`, `<=`, `>` or `>=` too. Lets now move on to a smaller example but using enums instead, because it makes a much bigger difference there:

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

And here you can see the "superpower" of this approach. Because we compare a scalar to a **group**, not a set value, we can use *any* grouped operation in the comparison. The grouped operation `MyEnum.(VAL1, VAL3, VAL5)` looks exaclty like a grouped field access, but for enum values. The resulting group will have the result type of `(MyEnum, MyEnum, MyEnum)`, so it's a homogeneous group and it has the same type as the scalar value. The size of the comparison where no group is used (the first one) will get larger and larger the more values are added to a point where it becomes barely readable. The the set-like comparison will stay look simple even when we add more values to it.

Note that set-like comparisons are *not* the same as writing out the group directly. For example when you would write `(me, me, me) == Enum.(VAL1, VAL3, VAL5)` it then the expression would only evaluate to true if `me` is equal to every value of the group, which is impossible. So, for set-like comparisons, splatting is **not** applied, and this is an important differentiation. The general rule of thumb is this: When doing arithmetic, splatting applies, when doing boolean logic, set-like comparisons apply.
