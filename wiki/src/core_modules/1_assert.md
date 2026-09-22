# assert

```ft
use Core.assert
```

The `assert` module provides a single `assert` function, which returns an error if the given condition evaluates to false. It is used for code-assertions and to fail loud and clear.

## error sets

These are the error sets this Core module provides.

```ft
error ErrAssert:
    AssertionFailed("The assertion has failed");
```

## functions

These are the functions this Core module provides.

### assert

```ft
def assert(bool condition) {ErrAssert};
```

```ft
use Core.assert

def main():
    i32 x = 5;
    assert(x > 6);
```

When executing this program you will see this error message printed to the console:

> ```
> The given error bubbled up to the main function:
>  └─ ErrAssert.AssertionFailed: "The assertion has failed"
> ```
