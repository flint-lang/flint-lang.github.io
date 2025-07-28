# assert

```rs
use Core.assert
```

The `assert` module provides a single `assert` function, which returns an error if the given condition evaluates to false. It is used for code-assertions and to fail loud and clear.

| Function Name | Parameter Types | Return Types | Possible Errors |
|--------------:|:----------------|:------------:|:---------------:|
| `assert`      | `bool`          | No           | `ErrAssert`     |


## error sets

These are the error sets this Core module provides.

### ErrAssert

This error set does not have a parent error, so it directly and only extends `anyerror` directly. These are the possible values this error could have:

| Error Value       | Description              |
|:------------------|:-------------------------|
| `AssertionFailed` | The assertion has failed |

## assert

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
