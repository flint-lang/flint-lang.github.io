# Named Opaque Types

A named opaque type is needed to distinguish two different opaque types, in order to provide some level of type-safety when dealing with opaques. Lets take a look at a small example to showcase this. We take this `extern.h` file:

```c
#include <stdio.h>
#include <stdlib.h>

typedef void *NamedOpaque;

NamedOpaque create_named_opaque() {
    printf("Creating new named opaque\n");
    NamedOpaque no = (NamedOpaque)malloc(8);
    *(size_t *)no = (size_t)100;
    return no;
}

void free_named_opaque(NamedOpaque *value) {
    printf("Freeing named opaque %p\n", *value);
    free(*value);
    *value = NULL;
}
```

and the `.fip/config/fip-c.toml` file looks like this:

```toml
[c]
headers = ["extern.h"]
sources = ["extern.h"]
command = ["clang", "-c", "-x", "c", "__SOURCES__", "-o", "__OUTPUT__"]
```

and then the main program looks like this:

```ft
use Fip.c

def main():
	NamedOpaque no = create_named_opaque();
	free_named_opaque(&no);
```

This program will print these lines to the console:

> ```
> Creating new named opaque
> Freeing named opaque 0x38a6d4c0
> ```

The auto-generated `.fip/generated/c.ft` file looks like this:

```ft
opaque NamedOpaque;
extern def create_named_opaque() -> NamedOpaque;
extern def free_named_opaque(mut NamedOpaque* value);
```

The `typedef void* NamedOpaque` directly resulted in a named opaque definition, `opaque NamedOpaque;`. Named opaques are incompatible with one another. Lets change the program a bit (the `fip-c.toml` file stays the same). The new `extern.h` now looks like:

```c
#include <stdlib.h>

typedef void *GLObject;
typedef void *GLFrame;

GLFrame create_frame() {
    GLFrame frame = (GLFrame)malloc(8);
    *(size_t *)frame = (size_t)100;
    return frame;
}

void free_frame(GLFrame *value) {
    free(*value);
    *value = NULL;
}

GLObject create_object() {
    GLObject frame = (GLObject)malloc(8);
    *(size_t *)frame = (size_t)100;
    return frame;
}

void free_object(GLObject *value) {
    free(*value);
    *value = NULL;
}
```

which results in this new auto-generated `c.ft` file:

```ft
opaque GLObject;
opaque GLFrame;
extern def create_frame() -> GLFrame;
extern def free_frame(mut GLFrame* value);
extern def create_object() -> GLObject;
extern def free_object(mut GLObject* value);
```

and the main file now looks like this:

```ft
use Fip.c

def main():
	GLFrame frame = create_frame();
	GLFrame object = create_object();

	free_frame(&frame);
	free_object(&object);
```

Now, when we try to compile the program we get this compile error:

> ```
> Parse Error at main.ft:5:22
> └─┬┤E0000│
> 3 │ def main():
> 5 │ »   GLFrame object = create_object();
> ┌─┴──────────────────────┘
> └─ Type mismatch of expression
>     ├─ Expected: GLFrame
>     └─ But got:  GLObject
> ```

This showcases the advantage we have when using named opaque types instead of raw `void*` in C or `opaque` in Flint: The compiler better understands the API and understands now that passing a `GLObject` typed value where a `GLFrame` is expected is just wrong! As you can see, even though *both* `GLFrame` and `GLObject` are a `void*` under the hood, they are fundamentally type-incompatible in Flint, preventing you from passing / storing opaque values to functions which expect something else.

This named opaque system, however, greatly depends on the quality of the C library itself (for auto-bindings). For example when a C function takes a raw `void*` parameter directly, there isn't much the Flint compiler or FIP can do here, in that case a regular `opaque` type is emitted for the parameter type (like in the `free` function for example).
