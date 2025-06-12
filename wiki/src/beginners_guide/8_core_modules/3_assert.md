# assert

```rs
use Core.assert
```

The `assert` module provides a single `assert` function, which returns an error if the given condition evaluates to false. It is used for code-assertions and to fail loud and clear.

```rs
use Core.assert

def main():
    i32 x = 5;
    assert(x > 6);
```

When executing this program you will see this error message printed to the console:

> ```
> ERROR: Program exited with exit code '10'
> ```

<div class="warning">

This error message is not final.

The whole error system of Flint is not yet finished, as the errors are all `i32` values at the moment still, and `error sets` are not supported yet. You will see an error message like
> ```
> ERROR: Assertion 'x > 6' failed at main.ft:5:5
> ```
but this needs a lot more work still to be finished.

</div>
