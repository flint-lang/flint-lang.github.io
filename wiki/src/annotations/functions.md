# functions

This section contains all annotations which can be applied to function definitions. Here is a list of all available annotations:

- [#fip_disable](#fip_disable)
- [#test_entry](#test_entry)

## `#fip_disable`

The `#fip_disable` annotation is only usable on `extern` functions. When defining an extern function, you can disable FIP-handling on a per-function basis. Normally FIP would start the available Interop Modules to find the given extern function in extern code somewhere. If you know that a function is available or linked to then you can add the `#fip_disable` function to mark that extern function as "resolved". A good example would be the `malloc` function, as it is part of the C library and thus available by default and without FIP:

```ft
#fip_disable
extern def malloc(u64 n) -> opaque;
```

## `#test_entry`

The `#test_entry` annotation is used to convert a given function to the "entry point" of the test binary. This annotated function is only allowed to have one of two forms:

```ft
#test_entry
def test_entry(str[] args):
    // ...
```

or

```ft
#test_entry
def test_entry(str[] args) -> i32:
    // ...
```

The name of the function does not matter, but it is recommended to just name it `test_entry` to prevent collisions with other functions. This converted function will be executed by the test-runner (internal `main` function which would normally call the user-defined `main` function) and all passed-in CLI arguments which are passed to the test binary will be passed to this function, like they normally would be parsed to the `main` function:

```ft
use Core.print

#test_entry
def test_entry(str[] args):
	for (i, arg) in args:
		print($"args[{i}] = \"{arg}\"\n");
```

> ```
> $ ./test
> args[0] = "./test"
> There are no tests to run
> ```

> ```
> $ ./test arg0 arg1 arg2
> args[0] = "./test"
> args[1] = "arg0"
> args[2] = "arg1"
> args[3] = "arg2"
> There are no tests to run
> ```

As you can see, the `entry` function is executed **before** any test ran. This is even true for the `init` tests. The very first thing which is executed will be the `entry` function. You are only allowed to define **one** test entry function for the entire project, just like with the `main` function.

With the entry function and the `init`, `deinit`, `pre` and `post` tests you are able to build very sophisticated testing frameworks for or with Flint. Since a test is just a "regular function" called by the test runner, you can also use Flint to write large test runners for other programs or languages.
