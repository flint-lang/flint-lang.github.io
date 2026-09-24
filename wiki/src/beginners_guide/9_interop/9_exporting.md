# Exporting

<div class="warning">

This feature is experimental.

This feature works but is still marked as experimental as not much testing was done to test it in all various scenarios. The shown examples work, but expect to run into bugs when using this feature extensively. It normally takes a bit of time for features to show their bugs, and as this feature is new, expect that there are still plenty of bugs in it.

</div>

Flint now is callable from the outside world. In the below examples, this "ouside world" is the `C` programming language.

## The `--lib` flag

The first thing we need to look at is the new `--lib <name>` flag of the Flint compiler. Lets assume we have a small program like this:

```ft
use Core.print

def add(i32 x, i32 y) -> i32:
	return x + y;

def main():
	print($"add(10, 20) = {add(10, 20)}\n");
```

And we compile it using

```sh
flintc main.ft --lib mylib
```

then the compiler will **not** produce a binary, like it normally would. Instead, it produces a `mylib.o` and `mylib.h` file and dumps them into the curent working directory. However, the `.h` file is completely empty. This is because we have not yet defined any function as `export`.

## `export`ed functions

In the above example, lets just change the `add` function definition:

```ft
export def add(i32 x, i32 y) -> i32:
	return x + y;
```

When we now re-run the above command the `mylib.h` file will have a content, and it will look like this:

```h
#pragma once

#include <stdbool.h>
#include <stdint.h>

#ifndef FLINT_OPT
#define FLINT_OPT(T) struct { bool has_value; T value; }
#endif

/// @brief Returns 'false' on failure and 'true' if everything was OK
extern bool mylib_init(void) asm("flint.init.mylib");

int32_t mylib_add(const int32_t x, const int32_t y) asm("HIjDPBBd.add.export");
```

The `FLINT_OPT` is flints internal representation of optionals, its macro is emitted even if no optional types are used in the exported file, you can ignore it for now.

The important parts are the `mylib_ini` and the `mylib_add`. As you can see, these names are only exposed to C, but internally in Flint (and in the emitted `.o` file) they are called `flint.init.mylib` and `HIjDPBBd.add.export` respectively.

## Using the exported `.h` and `.o` files

Lets now create a small `mylib.c` file in which we use the `mylib.h` file:

```c
#include "mylib.h"

#include <stdio.h>

int main(void) {
	int result = mylib_add(10, 20);
	printf("result = %i\n", result);
	return 0;
}
```

Okay, when we now try to compile the `mylib.c` file using this command (or any C compiler you want):

```sh
clang mylib.c mylib.o -o main
```

we get these linking errors:

> ```
> /usr/bin/ld: mylib.o: In Funktion »flint.dima.init.mylib«:
> main:(.text.flint.dima.init.mylib+0x7): undefinierter Verweis auf »TD1zR4xj.dima.head.data.TimeStamp«
> /usr/bin/ld: main:(.text.flint.dima.init.mylib+0x69): undefinierter Verweis auf »TD1zR4xj.dima.head.data.TimeStamp«
> /usr/bin/ld: main:(.text.flint.dima.init.mylib+0xc4): undefinierter Verweis auf »TD1zR4xj.dima.head.data.Duration«
> /usr/bin/ld: mylib.o: In Funktion »flint.clone«:
> main:(.text.flint.clone+0x19b): undefinierter Verweis auf »TD1zR4xj.dima.head.data.Duration«
> /usr/bin/ld: main:(.text.flint.clone+0x1a0): undefinierter Verweis auf »flint.dima.allocate«
> /usr/bin/ld: main:(.text.flint.clone+0x1cc): undefinierter Verweis auf »TD1zR4xj.dima.head.data.TimeStamp«
> /usr/bin/ld: main:(.text.flint.clone+0x1d1): undefinierter Verweis auf »flint.dima.allocate«
> /usr/bin/ld: mylib.o: In Funktion »flint.error.get_str«:
> main:(.text.flint.error.get_str+0x51): undefinierter Verweis auf »flint.string.create_str«
> /usr/bin/ld: mylib.o: In Funktion »Z5OgXomk.add.0«:
> /home/zweiler1/env/flint/flintc/tests/wiki/beginners_guide/interop/24_export_c/main.ft:4:(.text.Z5OgXomk.add.0+0x74): undefinierter Verweis auf »flint.arithmetic.i32_safe_add«
> clang: error: linker command failed with exit code 1 (use -v to see invocation)
> ```

This is because some DIMA types of Flint (more on that later) are part of the `libbuiltins.a` of Flint, a library of all builtin library stuff which the Flint runtime needs to function properly. But where is it? To get the path to the `libbuiltins.a` file you can just run

```sh
flintc --print-libbuiltins-path
```

which will just print your path to the console, in my case this path:

> ```
> /home/zweiler1/.cache/flintc
> ```

To get C to compile, we thus need to add this directory as a library path and then link with the `builtins` library:

```sh
clang mylib.c mylib.o -o main -L$(flintc --print-libbuiltins-path) -lbuiltins
```

And now we have an executable `main` which we can run, and when we run it we get this output:

> ```
> fish: Job 1, './main' terminated by signal SIGSEGV (Adressbereichsfehler)
> ```

But why does it crash?

## The `mylib_init` function

You saw the `mylib_init` function earlier in the `mylib.h` header file. To "fix" the above problem, you need to call the `mylib_init` function before calling **any** other function of the "library" `mylib` created by Flint:

```c
#include "mylib.h"

#include <stdio.h>

int main(void) {
    if (!mylib_init()) {
        printf("mylib_init failed\n");
        return 1;
    }
    int result = mylib_add(10, 20);
    printf("result = %i\n", result);
    return 0;
}
```

And now when we compile it using

```sh
clang mylib.c mylib.o -o main -L$(flintc --print-libbuiltins-path) -lbuiltins
```

again and run the built `main` we finally get this output:

> ```
> result = 30
> ```

The `mylib_init` function is very important to Flints runtime, as it initializes a lot of internal stuff needed by the runtime to even be able to evaluate a simple function like `add`. You will learn about those internals [later](../../intermediates_guide/4_callables/1_thread_stack.md). The `mylib_init` is checks internally if the things it initialized are already initialized. So, calling this function multiple times is well-defined, all later calls just early-return and do nothing. If you use Flint as a library in C, it is recommended to just call the init function at the very beginning of the program like shown above.
