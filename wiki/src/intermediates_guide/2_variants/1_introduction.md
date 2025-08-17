# Introduction

When we want to express the probability that a value could have one of a given collection of types we need to use `variant`s for it. You may have heard the term `tagged union` or `union` in other languages, like C, before. Flint's variants are exactly that.

A Variant in Flint, is defined like this:

```ft
variant MyVariant:
	i32, f32, u64;

def main():
	MyVariant var = 5;
```

This program will compile fine, and will have no output when being run. But before we can go deeper into variants we first need to look how they are _actually_ stored in memory and how they work under the hood.

First, let's recap the structure of optionals for a second. An optional `i32?` looks like this in memory roughly:

```c
struct {
    bool has_value;
    i32 value;
}
```

Note that this is not valid C code, it's just for demonstation purposes. Okay, but how does the `MyVariant` look like? It surely doesn't look like this:

```c
struct {
    u8 type;
    i32 t0;
    f32 t1;
    u64 t2;
}
```

right? Yeah it **definitely** does not look like that above, because the struct above would actually be `17` bytes big (ignoring padding and alignment for a second here). That's way to big for our types. So, what do we do then? Well, we know at compile-time what's the **maximum** space our `value` needs, we just need to look at all possible types the variant could have: `4` bytes for `i32`, `4` bytes for `f32` and `8` bytes for `u64`. We then just ask "what's the biggest value i possibly need to store?" and the answer to that would definitely be `u64` with `8` bytes.

So, we need atmost 8 bytes to store our value, so what do we do? It's pretty simple, we just do:

```c
struct {
    u8 type;
    u8[8] value;
}
```

We reserve `8` bytes for our value field of the struct. If we will now store an `i32` in the `value` the first 4 bytes will be used for that value and the other 4 bytes just stay empty. This means that our whole `variant` now uses exactly `9` bytes of memory, and if we would add another 10 possible types it would still only use the maximum size of them.

Okay and now let's talk about the `type` flag, because it's pretty interesting as well... When we define our variant from left to right we actually assign type IDs to each possible type of our variant. In our case the type `i32` will have the ID of `1`, `f32` will have `2` and `u64` will have `3`. But where is the `0`, you may ask. This will be explained in a [later]() chapter, but for now just know that it's reserved for the absence of values (optionals).

Okay, now you can define `variant` types and know how they look like under the hood, but how do you use them? We will learn this in the next chapter!
