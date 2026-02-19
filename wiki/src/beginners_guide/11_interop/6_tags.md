# Tags

Let's finally come to tags. They are absoltely essential for Flint's interop capabilities, and they once again would not have been possible without the FIP.

Let's say we have a `extern.c` file like this:

```c
#include <stdio.h>

typedef struct MyStruct {
    int x;
    float y;
    size_t z;
} MyStruct;

typedef enum MyEnum {
    VAL1 = 0,
    VAL2 = 1,
    VAL3 = 2,
    VAL4 = 4,
    VAL5 = 8,
} MyEnum;

void print_enum(const MyEnum e) {
    if (e == VAL1) {
        printf("is VAL1\n");
    } else if (e == VAL2) {
        printf("is VAL2\n");
    } else if (e == VAL3) {
        printf("is VAL3\n");
    } else if (e == VAL4) {
        printf("is VAL4\n");
    } else if (e == VAL5) {
        printf("is VAL5\n");
    } else {
        printf("is invalid enum value\n");
    }
}

void add_structs(MyStruct *s1, const MyStruct s2) {
    s1->x += s2.x;
    s1->y += s2.y;
    s1->z += s2.z;
}

void add(int *lhs, int rhs) {
    *lhs = *lhs + rhs;
}
```

And we define our `fip-c.toml` to look like this, as usual:

```toml
[c]
headers = ["extern.c"]
sources = ["extern.c"]
command = ["gcc", "-c", "__SOURCES__", "-o", "__OUTPUT__"]
```

The *module tag* is the `[c]` in our case. We could write *any* text in there, actually. The text should be an identifier, however, so it should only contain alphanumerics and underscores, just like defining any variable or type name in Flint.

Now comes a bit of "magic". This is the Flint code for our example:

```ft
use Core.print
use Fip.c

def main():
	s1 := MyStruct(-112, 22.1, 33_302);
	s2 := MyStruct(12, 17.9, 2_698);
	add_structs(&s1, s2);
	print($"s1.(x, y, z) = ({s1.x}, {s1.y}, {s1.z})\n");

	print_enum(MyEnum.VAL3);

	i32 x = 10;
	add(&x, 22);
	print($"x = {x}\n");
```

This example prints these lines to the console:

> ```
> s1.(x, y, z) = (-100, 40, 36000)
> is VAL3
> x = 32
> ```

As you can see we simply wrote `use Fip.c` and told Flint that it should search through all interop modules for a module which provides a tag called `c`. Then it found a module containing the `c` tag and it then auto-generated a file located in the `.fip` directory. The generated `.fip/generated/c.ft` file should look like this:

```ft
data MyStruct:
	i32 x;
	f32 y;
	u64 z;
	MyStruct(x, y, z);

enum MyEnum:
	VAL1 = 0,
	VAL2 = 1,
	VAL3 = 2,
	VAL4 = 4,
	VAL5 = 8;

extern def print_enum(const MyEnum e);
extern def add_structs(mut MyStruct* s1, const MyStruct s2);
extern def add(mut i32* lhs, mut i32 rhs);
```

But that's the beauty of it. You do not need to change a thing, you just tell FIP via the `fip-c.toml` which files it should search through and it auto-generated a Flint file containing all types and symbols defined in C. If you change your C code, add functions or remove them, the file will re-generate and update accordingly. This also means that it is not recommended to ever change the generated file manually, as the risk of changes becoming lost is extremely high since the compiler (and LSP) will just automatically override the file with the new bindings.

This enables a very fast work-flow when dealing with extern code. You change extern code and get immediate feedback in your Flint code if symbols changed for example.

## Import aliasing

Because the line `use Fip.c` results in a *real* file being generated, we can also alias the import:

```rs
use Core.print
use Fip.c as c

def main():
	s1 := c.MyStruct(-112, 22.1, 33_302);
	s2 := c.MyStruct(12, 17.9, 2_698);
	c.add_structs(&s1, s2);
	print($"s1.(x, y, z) = ({s1.x}, {s1.y}, {s1.z})\n");

	c.print_enum(c.MyEnum.VAL3);

	i32 x = 10;
	c.add(&x, 22);
	print($"x = {x}\n");
```

This program will print these lines to the console:

> ```
> ps1.(x, y, z) = (-100, 40, 36000)
> is VAL3
> x = 32
> ```

This means that now *all* things coming from C need to be prefixed with a `c.` which is pretty convenient. It also means that there are no naming collisions possible between code from C and code from Flint.

## Multiple Tags

As you might have guessed already, `fip-c` is not only limited to one tag either. So, let's add a second file to the `extern.c`, let's call it `ex2.c` and it should look like this:

```c
typedef struct Vector3 {
    float x, y, z;
} Vector3;

Vector3 vadd(const Vector3 v1, const Vector3 v2) {
    return (Vector3){
        .x = v1.x + v2.x,
        .y = v1.y + v2.y,
        .z = v1.z + v2.z,
    };
}
```

Then we simply add the `use Fip.ex2 as e` line to our code and use the functions and types provided by this additional module:

```rs
use Core.print
use Fip.c as c
use Fip.ex2 as e

def main():
	s1 := c.MyStruct(-112, 22.1, 33_302);
	s2 := c.MyStruct(12, 17.9, 2_698);
	c.add_structs(&s1, s2);
	print($"s1.(x, y, z) = ({s1.x}, {s1.y}, {s1.z})\n");

	c.print_enum(c.MyEnum.VAL3);

	i32 x = 10;
	c.add(&x, 22);
	print($"x = {x}\n");

	e.Vector3 v1 = (10.1, 20.2, 30.3);
	e.Vector3 v2 = (20.1, 30.2, 40.3);
	v3 := e.vadd(v1, v2);
	print($"v3 = {v3}\n");
```

This program will print these lines to the console:

> ```
> s1.(x, y, z) = (-100, 40, 36000)
> is VAL3
> x = 32
> v3 = (30.200001, 50.400002, 70.599998)
> ```

But wait... how can we print `v3` directly and how can we assign a group to it without calling the constructor??

Let's look at the `ex2.ft` which was generated from the `ex2.c` file:

```ft
type Vector3 f32x3
extern def vadd(const Vector3 v1, const Vector3 v2) -> Vector3;
```

Aha! Yes, using FIP the Flint compiler is able to detect when a data type overlaps with a multi-type of Flint. In this case `Vector3` overlaps with the type `f32x3` and that's why Flint emitted a type-alias to be able to use `f32x3` as `Vector3`. As type aliases completely vanish during parse-time it is now possible to assign a value of type `e.Vector3` to one of type `otherexternfile.Vector3`. Both `Vector3`'s will be detected to be equal to a multi-type which means that even if different C libraries provide different `Vector3` types, for example, we can still use them uniformly in Flint.

By using multiple tags for different source files / different libraries we can ensure that there exist no collisions between them. For example you could define your `fip-c.toml` file to look like this:

```toml
[raylib]
headers = ["/usr/include/raylib.h"]

[sdl]
headers = ["/usr/include/SDL/SDL.h", "/usr/include/SDL/SDL_audio.h"]
```

And then in Flint you would just need to write

```rs
use Fip.raylib as rl
use Fip.sdl as sdl
```

And boom there now no longer exist any collisions between those two libraries and you can use them both in Flint.
