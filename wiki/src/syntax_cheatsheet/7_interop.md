# Interop

## Extern Functions

```ft
// no body allowed
extern def hello();
extern def add(mut i32 x, mut i32 y) -> i32;
```

`extern def` is resolved at parse time by FIP. Signatures must match the C side exactly (C params are `mut` by default, so mark them `mut` to match).

## FIP Setup

```
.fip/
 └─ config/
     ├─ fip.toml
     └─ fip-c.toml
```

```toml
[fip-c]
enable = true
```

```toml
[c]
headers = ["hello.c"]
sources = ["hello.c"]
command = ["gcc", "-c", "__SOURCES__", "-o", "__OUTPUT__"]
```

- `headers` (mandatory): files to parse for symbols.
- `sources`/`command` (optional): how to build `.o` files; omit when linking a system library via `--flags="-l..."`.

## Interop Modules & Tags

The `[c]` header in `fip-c.toml` is a **module tag**. `use Fip.c` scans all active interop modules (like `fip-c`) for the tag and auto-generates bindings in `.fip/generated/c.ft`:

```ft
use Core.print
// aliasable like any import
use Fip.c as c

def main():
    c.MyStruct s1 = c.MyStruct(-112, 22.1, 33_302);
    // The `&` operator is the same as in C, address-of
    c.add_structs(&s1, s2);
    c.print_enum(c.MyEnum.VAL3);
```

Multiple tags keep libraries collision-free:

```toml
[raylib]
headers = ["/usr/include/raylib.h"]

[sdl]
headers = ["/usr/include/SDL3/SDL.h"]
```

```ft
use Fip.raylib as rl
use Fip.sdl as sdl
```

## Type Translation

| Flint | C               |
|-------|-----------------|
| bool  | `bool`          |
| u8    | `unsigned char` |
| i8    | `signed char`   |
| u16   | `unsigned short`|
| i16   | `short`         |
| u32   | `unsigned int`  |
| i32   | `int`           |
| u64   | `unsigned long` |
| i64   | `long`          |
| f32   | `float`         |
| f64   | `double`        |
| str   | `char*`         |


- `data` -> C struct; FIP only cares about the field layout, not the name (two Flint data types with the same layout can't both bind one extern function).
- Tuples/groups -> anonymous structs
- vectors (`f32x3` etc.) -> structs too (which is why raylib's `Vector3` maps onto `f32x3`).
- Prohibited in extern signatures: `object`, `func`, `interface`, optional, variant, `fn`, `bp`.
- Only pass immutable strings to C; resizing a string in C crashes Flint.

## Pointers

Pointers only exist in extern contexts:

```ft
extern def add(mut i32* lhs, mut i32 rhs);

def main():
    i32 x = 5;

    // & is reference-of
    add(&x, 10);
```

`&x` has type `i32*`. Pointer types in non-extern code are a compile error.

## Opaque Types

For `void*`; Flint doesn't know what it points to:

```ft
data Container:
    // maps to void*
    opaque value;
    u64 len;
    Container(value, len);

def main():
    // extern def malloc(u64) -> opaque
    opaque ptr = malloc(100);
    if ptr != null:
        ...
    free(ptr);
    // leak detection: non-null opaque at scope end prints error message
    ptr = null;
```

`null` is `void*` (type `0x0`) and casts to any opaque. Opaque values can only be compared with `null`, not dereferenced or cast.

## Named Opaque Types

```ft
// from `typedef void* GLObject;`
opaque GLObject;
opaque GLFrame;
```

Named opaques are type-incompatible with each other (`GLFrame` is not assignable to `GLObject`) even though both are `void*` under the hood. Generated automatically by FIP.
