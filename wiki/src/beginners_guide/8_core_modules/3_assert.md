# assert

```ft
use Core.assert
```

The `assert` module provides a single `assert` function, which returns an error if the given condition evaluates to false. It is used for code-assertions and to fail loud and clear.

| Function Name | Parameter Types | Return Types | Possible Errors |
| ------------: | :-------------- | :----------: | :-------------: |
|      `assert` | `bool`          |      No      |   `ErrAssert`   |

## error sets

These are the error sets this Core module provides.

### ErrAssert

This error set does not have a parent error, so it directly and only extends `anyerror` directly. These are the possible values this error could have:

| Error Value       | Description              |
| :---------------- | :----------------------- |
| `AssertionFailed` | The assertion has failed |

## assert

```ft
use Core.assert

def main():
    i32 x = 5;
    assert(x > 6);
```

When executing this program you will see this error message printed to the console:

> ```
> ERROR: main function returned error
>  - type_id: 2448605372
>  - value_id: 0
>  - message: "The assertion has failed"
> ```
