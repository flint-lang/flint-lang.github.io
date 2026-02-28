# Opaque Types

What are opaque types? An opaque type, or `opaque` in Flint, is simply a pointer to memory where Flint neither knows where it points to nor does it know what it points to. If we would define an extern function like `extern def add(mut i32* x, mut i32 y)` then we *know* where `x` points to, the pointer `i32*` points to a value of type `i32`. But if we do *not* know where a pointer points to then we need to use `opaque`.

If you are familiar with C, then the concept of opaque pointers should be nothing new to you: In C an opaque pointer is the type `void*`. It's not a pointer which points "to nothing", it can be seen more as a pointer which could point **to anything**. For example the `malloc` function in C returns a `void*` to the allocated memory and then needs to be cast to other pointer types to be used.

Flint has no internal concepts of pointers, so if you define a "normal" function or variable they **cannot** be of any pointer type, like `i32*`. But when using C libraries it is very common for functions and even data itself to contain opaque pointers. Take this C struct type for example:

```c
typedef struct Container {
    void *value;
    size_t len;
} Container;
```

For this type to be translatable to Flint types we need a concept of types in Flint without enabling raw pointers, pointer arithmetic and all the other low level things you could do with pointers. The above C type would translate to this data type in Flint (for example when auto-generating the bindings file using FIP):

```ft
data Container:
    opaque value;
    u64 len;
    Container(value, len);
```

As you can see, the `value` has the type `opaque` in Flint and this enables us to interact with C and C types even though we do *not* know of which type they are.

## Example

Let's take this simple C file, `extern.c` here:

```c
#include <stdlib.h>

typedef struct Container {
    void *value;
    size_t len;
} Container;

Container create() {
    return (Container){
        .value = malloc(100),
        .len = 100,
    };
}

void destroy(Container *c) {
    free(c->value);
    c->value = NULL;
    c->len = 0;
}
```

And use it using `use Fip.c` in Flint like so:

```ft
use Core.print
use Fip.c

def main():
	c := Container(null, 0);
	print($"c.value = {c.value}\n");
	print($"c.len = {c.len}\n");

	con := create();
	print($"con.value = {con.value}\n");
	print($"con.len = {con.len}\n");
	destroy(&con);
```

This program will print these lines to the console:

> ```
> c.value = null
> c.len = 0
> con.value = 0x2e89ab20
> con.len = 100
> ```

And this `c.ft` file being generated in `.fip/generated/c.ft`:

```ft
data Container:
	opaque value;
	u64 len;
	Container(value, len);

extern def create() -> Container;
extern def destroy(mut Container* c);
```

There is quite a lot to unpack here. First of all, let's start with the `null` literal. The `null` literal is exactly the same as `NULL` in C or `nullptr` in C++ (and newer C). It's just a nullpointer, e.g. `0x0`. The `null` literal in Flint is of type `void*` and can be cast to any pointer and any opaque type of Flint. The type of `void*` was chosen because that type is not possible to define in Flint, thanks to the addition of the `opaque` type. Note that `opaque` is a distinct type in Flint, so it's *not* a `void*` under the parsers surface.

As you can also see, the `opaque` type is part of the builtin types and can be cast to a string as a consequence. Note that the exact memory adress of your program might differ, so the exact output might not even match exactly to the output shown above.

What Flint is concerned are `opaque` values truly opaque to it. They cannot be cast to "real" pointer types, and they cannot be accessed in any way. We can *only* compare them with the `null` literal to see if it's a nullpointer or not.

## Comparing opaque values with null

Let's keep the `extern.c` file the same, but now we change the `main.ft` a bit:

```ft
use Core.print
use Fip.c

def main():
	c := Container(null, 0);
	print($"c.value = {c.value}\n");
	print($"c.len = {c.len}\n");

	con := create();
	if con.value == null:
		print("con.value is null\n");
	else:
		print("con.value points to something\n");
	print($"con.len = {con.len}\n");
	destroy(&con);
	if con.value == null:
		print("con.value was properly freed\n");
```

This program will print these lines to the console:

> ```
> c.value = null
> c.len = 0
> con.value points to something
> con.len = 100
> con.value was properly freed
> ```

As you can see, it always is pretty easy to tell if a pointer is a null pointer or not. And at this very topic and fact, that it is trivial to compare pointers to a nullpointer, comes the next thing to play.

## Leak detection

In Flint, opaque values point to memory. This memory needed to be allocated by C. This means that we need a very simple approach of leak-detection for external resources in Flint. The easiest and most straight forward way is to simply check each `opaque` typed value (both variables and fields of data) if they are `null` whenever they go out of scope / out of memory and if the `opaque` value still points somewhere in memory then it is considered to be still in-use memory, e.g. was not freed yet. Flint does not free `opaque` values by itself, instead it throws a runtime panic about leak detection at you.

Here is a small example of exactly this behaviour. Take the same example as above bt remove the `destroy(&con);` line:

```ft
use Core.print
use Fip.c

def main():
	c := Container(null, 0);
	print($"c.value = {c.value}\n");
	print($"c.len = {c.len}\n");

	con := create();
	if con.value == null:
		print("con.value is null\n");
	else:
		print("con.value points to something\n");
	print($"con.len = {con.len}\n");
	if con.value == null:
		print("con.value was properly freed\n");
```

This program now will print these lines to the console:

> ```
> c.value = null
> c.len = 0
> con.value points to something
> con.len = 100
> Error: Leaking memory!
> ```

The behaviour of the leak-detection for `opaque` types can be controlled with the `--opaque-XXX` flags of the `flintc` compiler.

## Low level calls

This whole design of opaque types has a very profound side-effect: we are now able to manually call things like `malloc` or `free` from within Flint itself. We cannot use the allocated values, however, that still needs to be done by extern C code. You can think about it like that: `malloc` *is* a C function so "ownership" of the allocated thing naturally is at C. And when freeing it, by calling `free` we "tell C to free it". We just had a `opaque` pointer to the memory but Flint cannot do anything with it. Here is a small example, now the `extern.c` file changes:

```c
void *malloc(unsigned long n);
void free(void *ptr);
```

And the Flint code now looks like this:

```ft
use Core.print
use Fip.c

def main():
	opaque ptr = malloc(100);
	if ptr != null:
		print($"allocation of {100} bytes successful\n");
	free(ptr);
	print("freeing of ptr successful\n");
```

And this is how the auto-generated `.fip/generated/c.ft` file looks now:

```ft
extern def malloc(mut u64 n) -> opaque;
extern def free(mut opaque ptr);
```

This program prints these lines to the console:

> ```
> allocation of 100 bytes successful
> freeing of ptr successful
> Error: Leaking memory!
> ```

As you can see, we still get a leak error despite freeing the value, what's going on here? It's pretty simple. `free` at a low level just frees the memory the pointer `ptr` we passed to it points to, but it does not change the pointer `ptr` itself. We need to manually and explicitely set it's value to `null` after freeing in this case:

```ft
use Core.print
use Fip.c

def main():
	opaque ptr = malloc(100);
	if ptr != null:
		print($"allocation of {100} bytes successful\n");
	free(ptr);
	print("freeing of ptr successful\n");
	ptr = null;
```

And now this program will print only these lines to the console:

> ```
> allocation of 100 bytes successful
> freeing of ptr successful
> ```

This encourages you to either do it as in the `destroy` function at the top where we set the pointer to `NULL` after freeing it, or you need to do it manually in Flint. Either way, Flint's "leak detection" only checks whether an opaque value is null, nothing more. Keep this fact in mind!
