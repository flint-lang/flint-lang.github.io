# Pointer Types

Flint does come with pointer types and a single pointer-related operation. In this chapter we will talk about why it needs them and how to use them. Let's start with a very simple example in C. Let's say you are working with a C library which contains a function like this:

```c
void add(int *lhs, int rhs) {
    *lhs = *lhs + rhs;
}
```

and you want to use that function in Flint. Without pointers it would not be possible, because we would not be able to express the function's signature precisely. But with pointers, we can! Here is how the Flint example looks:

```ft
use Core.print

extern def add(mut i32* lhs, mut i32 rhs);

def main():
    i32 x = 5;
    i32 y = 10;
    add(&x, y);
    print($"x = {x}\n");
```

This program will print this line to the console:

> ```
> x = 15
> ```

You can also spot the `&` operator here. It's role is very simple: It acts like a *reference-of* operator and the result of this operation is a pointer, so the expression `&x` has the type of `i32*` because `x` is of type `i32`.

Pointer types are **only** allowed in an external context. Let's look at a small example to showcase what this means. Let's say you would want to use pointers outside of an external context in Flint:

```ft
use Core.print

def add(mut i32* lhs, i32 rhs):
    i32* a = lhs;
    a = &rhs;

def main():
    i32 x = 5;
    i32 y = 10;
    add(&x, y);
    print($"x = {x}\n");
```

This simply will *not work*. You will get this compilation error:

> ```
> Analyzing Error at main.ft:3:13
> └─┬┤E0000│
> 3 │ def add(mut i32* lhs, i32 rhs):
> ┌─┴─────────────┘
> ├─ Pointer types are not allowed in non-extern functions
> └─ A pointer type 'T*' can only be used when defining or calling 'extern' functions
> ```

Flint aims to be an easy and high level language, and pointers make everything more complicated than they need to be. We could fix the above error by removing the pointers from the function definition and putting pointer operations and types inside of the function body instead:

```ft
use Core.print

def add(i32 lhs, i32 rhs):
	i32* a = &lhs;
	a = &rhs;

def main():
	i32 x = 5;
	i32 y = 10;
	add(x, y);
	print($"x = {x}\n");
```

and now we will get a different but related error:

> ```
> Analyzing Error at main.ft:4:14
> └─┬┤E0000│
> 3 │ def add(i32 lhs, i32 rhs):
> 4 │ »   i32* a = &lhs;
> ┌─┴──────────────┘
> ├─ Pointer types are not allowed in non-extern contexts
> └─ A pointer type 'T*' can only be used when defining or calling 'extern' functions
> ```

As you can see, it simply is not possible in Flint to use pointers outside of an extern context. This is by design, since having support for raw pointers would introduce a level of unsafety which I do not want to have in Flint. So if you would want to pass in a primitive to a function and modify it, you can't. Primitive types are always passed by *value* and complex types, like `data`, is always passed by *reference*.
