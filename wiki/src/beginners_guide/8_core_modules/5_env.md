# env

```rs
use Core.env
```

The `env` module provides several functions to read from and write to environment variables.

| Function Name | Parameter Types      | Return Types | Can Throw? |
|--------------:|:---------------------|:------------:|:----------:|
| `get_env`     | `str`                | `str`        | Yes        |
| `set_env`     | `str`, `str`, `bool` | `bool`       | No         |

## get_env

The `get_env` function recieves the currently stored value of a given environment variable (`str`). The content of the environment variable is returned as a `str`. This function will throw an error if the requested environment variable does not exist.

```rs
use Core.print
use Core.env

def main():
    print($"HOME = {get_env("HOME")}\n");
```

This program will print this line to the console:

> ```
> HOME = /home/zweiler1
> ```

## set_env

The `set_env` function sets a given environment variable (`str`) to a newly specified value (`str`). The third parameter (`bool`) controls whether the given environment variable should be overwritten if it already exists. If the third parameter is `false` an already existent environment variable wont be overwritten. This function cannot throw any errors.

```rs
use Core.print
use Core.env

def main():
    bool overwrite_home = set_env("HOME", "something new", false);
    print($"HOME overwritten? {overwrite_home}\n");
    print($"HOME value: {get_env("HOME")}\n");

    bool create_new = set_env("NEW_ENV_VARIABLE", "some nice value", false);
    print($"NEW_ENV_VARIABLE craeted? {create_new}\n");
    print($"NEW_ENV_VARIABLE content: {get_env("NEW_ENV_VARIABLE")}\n");
```

This program will print these lines to the console:

> ```
> HOME overwritten? true
> HOME value: /home/zweiler1
> NEW_ENV_VARIABLE craeted? true
> NEW_ENV_VARIABLE content: some nice value
> ```
