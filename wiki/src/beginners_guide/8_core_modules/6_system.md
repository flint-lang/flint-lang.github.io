# system

```rs
use Core.system
```

The `system` module provides functions to interact with the system, for example to execute system commands.

| Function Name    | Parameter Types | Return Types | Possible Errors |
|-----------------:|:----------------|:------------:|:---------------:|
| `system_command` | `str`           | `i32`, `str` | `ErrSystem`     |

## error sets

These are the error sets this Core module provides.

### ErrSystem

This error set does not have a parent error, so it directly and only extends `anyerror` directly. These are the possible values this error could have:

| Error Value     | Description                                        |
|:----------------|:---------------------------------------------------|
| `SpawnFailed`   | Process could not be created                       |

## system_command

The `system_command` function executes a given command, for example `ls -lah` and returns the exit code of the given command together with the output of the command, stored in a string. The function can throw an error if the process (the command) cannot be created.

```rs
use Core.print
use Core.system

def main():
    (exit_code, output) = system_command("ls");
    print($"exit_code = {exit_code}\n");
    print($"output = '{output}'\n");
```

This program will print these lines to the console:

> ```
> exit_code = 0
> output = 'build
> build.zig
> build.zig.zon
> cmake
> CMakeLists.txt
> compile_flags.txt
> documents
> examples
> fetch_crt.sh
> include
> LICENSE
> logfile
> lsp
> main
> main.o
> main.obj
> output.ll
> README.md
> resources
> scripts
> src
> test
> test_files
> test.o
> tests
> vendor
> '
> ```
