# Tests

Tests are really easy in Flint to add. A test is a special kind of function:

```ft
use Core.assert

test "succeeds":
    assert(true);

test "fails":
    assert(false);
```

You need to compile this program with the `--test` flag added to it (`flintc --file main.ft --test`). This command will (by default) produce a binary called `test` instead of the otherwise automatically created `main` binary.
This program will print these lines to the console:

> ```
> main.ft:
>  ├─ succeeds ✓ passed
>  └─ fails    ✗ failed
>
> ✗ 1 test failed!
> ```

As you can see, there is no `main` function in this file and compilation does not crash. This is because when defining tests not the user-defined main function is *ever* called. Instead, all "test functions" of all files are executed and evaluated. A test succeeds when it does not return an error. So, if you throw within a test then that test will fail (for example the `assert(false);` call throws the `ErrAssert` error). Using the test functions you are able to test your code for correctness.

## Name uniqueness

The defined name in the string after the `test` keyword is the name of the test. Every file is only allowed to contain one test with the same name, so all tests within a given file must have a unique name:

```ft
use Core.assert

test "testA":
    assert(true);

test "testA":
    assert(false);
```

When you try to compile the above example you will get this compilation error:

> ```
> Parse Error at main.ft:6:6
> └─┬┤E0000│
> 6 │ test "testA":
> ┌─┴──────┘
> ├─ The test 'testA' is already defined in this file
> └─ Each test within a file must have a unique name
> ```

## Best practices

It is considered best practice to put the tests directly into the files where the functions you are testing are defined in. Tests can be used for unit testing, performance testing etc. so they are very useful when writing software. It is recommended to put all tests at the very bottom of the file, after all function definitions. This way you can be sure that whenever the test sections in a file begins no further definitions will follow, only tests.

Tests are not compiled into the binary when not compiling with the `--test` flag. This means that you can write a million tests for a simple hello world program and as long as you do not compile with the `--test` flag all those tests will be simply ignored and will never even enter the code-generation part of the compiler.
