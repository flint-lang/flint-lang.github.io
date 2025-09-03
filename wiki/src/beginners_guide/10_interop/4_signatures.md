# Signatures

First, we need to get a basic fact about FIP out of the way. Because C has evolved more or less into an interop standard over the years, nearly all types of all languages are somewhat translatable to C types, and the FIP is definitely based on that. FIP can *only* express types which are also present in C, which means it *could* essentially represent *every* possible type of a language. But for simplicity and other reasons (like memory safety), interoperability of a few types is prohibited. These are the prohibited types, which you **cannot** have contained inside of extern definitions:

- `entity` types
- `func` types
- `optional` types
- `variant` types
- `fn` types
- `bp` types

These types are prohibited because other languages may define them in a different way, so when you call a function from Rust which has an `Option<T>` argument type and you set the extern signature in Flint to `T?` we cannot guarantee that both ends convey to the same type under the hood, as C has no concept of optionals.

Many of those types will be introduced in later chapters, don't worry about them for now. But let's get into the topic of this chapter now and let's discuss how each Flint type will translate into C types. This is done through tables, it's just the most convenient and efficient this way.

## Primitives

The first and most logical beginning point are primitive types. The only outlier are strings essentially, but let's look at each type.

| Flint Type | C Eqivalent   |
|------------|---------------|
| bool       | bool          |
| u8         | unsigned char |
| u32        | unsigned int  |
| u64        | unsigned long |
| i32        | int           |
| i64        | long          |
| f32        | float         |
| f64        | double        |
| str        | char*         |

Of course, all the types on the left and right do not match in their mutability, as of the last example. To change the C mutability you can simply put `const` in front, and on Flint you can put `mut` or `const` in front.

Re-sizing and relocating the string inside of C will result in a crash inside of Flint, as the string it pointed to is no longer valid, so be aware that interoping with C could very well break stuff in wonky ways.

## Data

Flint's data is essentially a struct annyway, so interop with C is very easy. This following data type:

```ft
use Core.print

data MyData:
    i32 x;
    i32 y;
    f32 speed;
    bool is_something;
    MyData(x, y, speed, is_something);

extern def do_something(MyData md) -> MyData;

def main():
    md := MyData(10, 10, 3.2, false);
    print($"md.(x, y, s, i) = ({md.x}, {md.y}, {md.speed}, {md.is_something})\n");
    md = do_something(md);
    print($"md.(x, y, s, i) = ({md.x}, {md.y}, {md.speed}, {md.is_something})\n");
```

is directly translatable to this C struct type:

```
typedef struct {
    int x, y;
    float speed;
    bool is_something;
} MyData;

MyData do_something(const MyData md) {
    MyData result = {0};
    result.x = md.x + 2;
    result.y = md.y + 5;
    result.speed = md.speed / 2;
    result.is_something = true;
    return result;
}
```

This code will produce this output:

> ```
> md.(x, y, s, i) = (10, 10, 3.2, false)
> md.(x, y, s, i) = (12, 15, 1.6, true)
> ```

So, a function expecting a struct as it's parameter in C can be called like above directly. Note that there exists a specific chapter talking about pointer types, so the C function `MyData do_something(const MyData *md)` will have a different Flint signature, but you will learn about this later.

FIP handles all the ABI-specifics for you, so you can call into C functions and pass structs to them without ever writing any bindings yourself.

But there is more to talk about. First of all, FIP absolutely does not care what *names* you gave your structs. The `MyData` type will look like this for FIP: `{ i32, i32, f32, bool }`. The `{` and `}` are the structure symbols, all types within these are members of the struct FIP handles. So, this means that you can do something like this without a problem:

```ft
use Core.print

data MyData:
    i32 x;
    i32 y;
    f32 speed;
    bool is_something;
    MyData(x, y, speed, is_something);

data SomeData:
    i32 x;
    i32 y;
    f32 z;
    bool w;
    SomeData(x, y, z, w);

extern def do_something(MyData md) -> MyData;
extern def do_something(SomeData md) -> SomeData;

def main():
    md := MyData(10, 10, 3.2, false);
    print($"md.(x, y, s, i) = ({md.x}, {md.y}, {md.speed}, {md.is_something})\n");
    md = do_something(md);
    print($"md.(x, y, s, i) = ({md.x}, {md.y}, {md.speed}, {md.is_something})\n");

    sd := SomeData(10, 10, 3.2, false);
    print($"sd.(x, y, s, i) = ({sd.x}, {sd.y}, {sd.z}, {sd.w})\n");
    sd = do_something(sd);
    print($"sd.(x, y, s, i) = ({sd.x}, {sd.y}, {sd.z}, {sd.w})\n");
```

Note that the C header file stayed exactly the same, it did not change. We actually call **the same** C function twice, just with "different" data. They are different data types in Flint, but what FIP is concerned, they are both just `{ i32, i32, f32, bool }` without any name. Conceptually this should work, but we have decided to not let this code be valid, because the moment you try to reference the same external C function twice through different code paths, the codebase becomes *really* messy *really* quick. So, this example should work conceptually, but it will result in this compile error:

> ```
> Generation Error at main.ft:18:1
> └──┬┤E0000│
> 18 │ extern def do_something(SomeData md) -> SomeData;
> ┌──┴─┘
> ├─ Defined extern function 'do_something' twice
> └─ It was first defined at main.ft:17:1
> ```

There is no reason to why it could not work, other than compiler internal complexity and resulting code complexity. If you want to call the same underlying external functions from two different types, you have done something wrong when designing your code, so this definitely is not the fault of FIP or the Flint Compiler.

## Multi-Types

Flint has builtin vector types, the multi-types, as you know. These types are actually represented as true vector types inside of LLVM IR code, nut just structs, but C does not have true vector types (native to the language, without compiler extensions). So we cannot add vector types to FIP since C does not have them, and FIP has to be C-compatible with it's internal types, as discussed earlier. Which type should multi-types be converted to, then? Well, they are just converted to simple structs before passing them to C. The multi-type `f32x3` becomes `{ f32, f32, f32 }` for example, or `i64x2` becomes `{ i64, i64 }`. There really is nothing special about it at all, but the complications of this design are very nice.

You see, A LOT of different libraries, especially those related to math, rendering or something vector-related provide their own types, like raylib's `Vector3` struct, for example. So, this allows us to write something like the following:

```
typedef struct {
    float x, y, z;
} Vector3;

Vector3 add(const Vector3 v1, const Vector3 v2) {
    return Vector3{v1.x + v2.x, v1.y + v2.y, v1.z + v2.z};
}
```

```ft
use Core.print

extern def add(f32x3 v1, f32x3 v2) -> f32x3;

def main():
    f32x3 v1 = (1.2, 2.3, 4.5);
    f32x3 v2 = (12.5, 66.8, 35.98);
    f32x3 res = add(v1, v2);
    print($"res = {res}\n");
```

Which will print this line to the console:

> ```
> res = (13.7, 69.100006, 40.48)
> ```

So, what does this mean for Flint? Because multi-types are lowered to structs when calling extern functions, you can absolutely interacti with C functions and directly pass in your multi-type vectors to them or recieve them from the C functions. You could for example do all vector operations within Flint, since all multi-types utilize SIMD instructions under the hood, and then just pass them to the C code for rendering etc.
