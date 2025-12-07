# Interop Modules

Interop Modules (IMs) are the small individual pieces which are repsponsible for external languages. For this chapter we will focus on the `fip-c` IM. So, the project from the previous page is still broken and results in a compilation error, and we now want to fix that situation.

If you have not installed the `fip-c` IM yet, please follow the instructions in the [FIP Setup](user_guide/setup/4_fip_setup.md) page and then continue on with this chapter when FIP is installed.

Now, with the `fip-c` IM installed, we can try to run the command again:

```sh
flintc --file main.ft
```

Because compilation now succeeded, you will see absolutely no output, but the `main` executable has been created. When running the compiled program you will see this line printed to the console:

```
Hello from C!
```

That was a lot to do just to get interop up and running, I admit that. But this whole process can (and will) be done using tools too. The `flint` executable (or maybe the `flintc` executable should handle that, I am not sure yet) will contain the capability to set up FIP for us. But, let's talk about all those directories, what they do and why they exist. First, let's talk about the `modules` directory and what the content in the `fip.toml` *actually* means. The `fip.toml` file has a very simple content, it's just these two lines:

```toml
[fip-c]
enable = true
```

This essentially tells the compiler to search for the `fip-c` module in the `$HOME/.local/share/fip/modules/` (or `%LOCALAPPDATA%\fip\modules\` on Windows) directory and to start it when the compiler starts up. It essentially tells the compiler that the module exists and should be used by it. And then we have the `fip-c.toml` file. It only contains three entires, which are all not special at all:

```toml
compiler = "gcc"
sources = ["hello.h"]
compile_flags = []
```

The `compiler` field tells the `fip-c` module which compiler to use to compile the C source file(s), in our case it's `gcc`.

If you are on Windows then you would need a C compiler and possibly a Developer PowerShell from the VS setup. So, you need to handle how to compile the extern language, like C, by yourself on Windows. On Linux, `gcc` is just available in the `PATH` variable and no setup is required from Your side.

Next we have the `sources` field. It's an array of filepaths to all the header or source files we interact with and we want to call into. You may noticed that we have not written any bindings or wrappers for the C functions at all, we just declared a function to be extern and then used it inside of Flint, and FIP figured out the rest for us. Okay, let's edit our header file and add another function to it, this time adding two numbers together:

```
#include <stdio.h>

void hello() {
    printf("Hello from C!\n");
}

int add(int x, int y) {
    return x + y;
}
```

And then we also need to update the `main.ft` file:

```ft
use Core.print

extern def hello();
extern def add(i32 x, i32 y) -> i32;

def main():
    hello();
    print($"add(1, 8) = {add(1, 8)}\n");
```

And when we then try to compile this program we get yet another error:

> ```
> Parse Error at test_files/test_minimal.ft:4:1
> └─┬┤E0000│
> 4 │ extern def add(i32 x, i32 y) -> i32;
> ┌─┴─┘
> └─ Extern function could not be found in any FIP module
> ```

<div class="warning">

This error message is not final, since it does not contain any information to *what* actually failed.

You need to use `flintc-debug` for the time being to actually find out what went wrong. When looking at the FIP logs, which start with `[Master]:` or `[Slave N]:` you can find out which symbols the `fip-c` module found and which symbol the Flint Compiler is searching for. You can find these lines in the output of the `flintc-debug` build:

```
[Slave 1]: Found extern function: 'hello' at line 3
[Slave 1]:   Function Signature:
[Slave 1]:     name: hello
[Slave 1]: Found extern function: 'add' at line 7
[Slave 1]:   Function Signature:
[Slave 1]:     name: add
[Slave 1]:     arg[0]: mut i32
[Slave 1]:     arg[1]: mut i32
[Slave 1]:     ret[0]: mut i32
[Slave 1]: Found 2 extern functions in hello.h
```

And later on

```
[Slave 1]: Symbol Request Recieved
[Slave 1]:   Function Signature:
[Slave 1]:     name: add
[Slave 1]:     arg[0]: const i32
[Slave 1]:     arg[1]: const i32
[Slave 1]:     ret[0]: mut i32
```

And here you can actually see what the problem is. It's a signature mismatch.

</div>

Remember that all function parameters of Flint are implicitely `const` except marked as `mut` explicitely, and that's exactly the mismatch happening here. The `fip-c` module found the function `int add(int x, int y)` which has the signature `add(mut i32, mut i32) -> i32` in C, and we expected to find a function `add(const i32, const i32) -> i32` defined in Flint. To resolve this problem we either need to edit the C code or edit the signature of our Flint function. Often times you will deal with C libraries you will not be able to change, so changing the Flint function signature would be your only option in such cases, so we now simply change this line:

```ft
extern def add(i32 x, i32 y) -> i32;
```

to this line:

```ft
extern def add(mut i32 x, mut i32 y) -> i32;
```

And now when we compile and run the program we will get this output:

> ```
> Hello from C!
> add(1, 8) = 9
> ```

As you can see, it is very important that signatures match exactly when calling extern functions. Matching signatures is the basis of FIP, and we will talk more about which Flint types relate to which C types so that you do not need to wonder what went wrong.
