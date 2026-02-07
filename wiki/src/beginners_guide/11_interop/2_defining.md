# Defining External Functions

First of all, we need to actually define a function we want to use from the extern code. Let's start with the C code for this example. Create a file named `hello.h` in the root directory of your project, it should contain this code:

```
#include <stdio.h>

void hello() {
    printf("Hello from C!\n");
}
```

Then you need to write the following code into your `main.ft` file:

```ft
extern def hello();

def main():
    hello();
```

As you can see, we can define `extern` functions simply by adding the `extern` keyword in front of the function definition. What you also can see is that the function does not have a body. Adding a body to extern functions is not allowed, and it will result in a compile error.

You can now try to compile the Flint file using the command

```sh
flintc --file main.ft
```

You should see a output like the following:

> ```
> Parse Error at main.ft:1:1
> └─┬┤E0000│
> 1 │ extern def hello();
> ┌─┴─┘
> ├─ No '.fip' directory found
> ├─ To be able to interop with extern code you need the FIP set up
> └─ For further information look at 'https://flint-lang.github.io/v0.3.1-core/beginners_guide/11_interop/2_defining.html'
> ```

This tells us that FIP is not active in the compiler yet, but how comes that? FIP is only active and activated when there exists a `.fip` directory containing a `config` directory containing a `fip.toml` configuration file. If the configuration file is faulty or nonexistent, FIP will not launch, so calling external functions will not work.
To resolve this, you need to create a `.fip` directory in your source directory and in that create a `config` directory and put a `fip.toml` file in there. The `fip.toml` should look like this:

```toml
[fip-c]
enable = true
```

We also need to create a `fip-c.toml` configuration file to be able to use the extern defined `.h` header file. Create a `fip-c.toml` file in the config directory, it should look like this:

```toml
compiler = "gcc"
sources = ["hello.h"]
compile_flags = []
```

The resulting file structure should look like this:

```
.fip/
 └─ config/
     ├─ fip.toml
     └─ fip-c.toml
hello.h
main.ft
```

With these configuration files added, let's try to compile the program again:

```sh
flintc --file main.ft
```

And now we... still see the same error? Yes. FIP is based on the concept of Interop Modules, and we will fix our problem in the next chapter!
