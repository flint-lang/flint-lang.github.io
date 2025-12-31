# system

```ft
use Core.system
```

The `system` module provides functions to interact with the system, for example to execute system commands.

|    Function Name | Parameter Types | Return Types | Possible Errors |
| ---------------: | :-------------: | :----------: | :-------------: |
| `system_command` |      `str`      | `i32`, `str` |   `ErrSystem`   |
|    `get_cwd`     |       No        |    `str`     |       No        |
|    `get_path`    |      `str`      |    `str`     |       No        |

## error sets

These are the error sets this Core module provides.

### ErrSystem

This error set does not have a parent error, so it directly and only extends `anyerror` directly. These are the possible values this error could have:

| Error Value    | Description                    |
| :------------- | :----------------------------- |
| `EmptyCommand` | The provided command was empty |
| `SpawnFailed`  | Process could not be created   |

## functions

These are the functions this Core module provides.

### system_command

The `system_command` function executes a given command, for example `ls -lah` and returns the exit code of the given command together with the output of the command, stored in a string. The function can throw an error if the process (the command) cannot be created.

```ft
use Core.print
use Core.system

def main():
    (exit_code, output) = system_command("ls");
    print($"exit_code = {exit_code}\n");
    print($"--- OUTPUT ---\n {output}");
```

This program will print these lines to the console:

> ```
> exit_code = 0
> --- OUTPUT ---
> build
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
> ```

### get_cwd

The `get_cwd` function is used to get the current working directory. The current working directory is the directory in which the program was executed in. It's main purpose is to be used together with the `get_path` function to get paths to files relative to the executed program's directory.

```ft
use Core.print
use Core.system

def main():
    str cwd = get_cwd();
    print($"cwd = {cwd}\n");
```

This program will print a line like this to your console:

> ```
> cwd = /home/zweiler1/env/flint/flintc
> ```

### get_path

The `get_path` function is used to convert a string to the platform-specific requirements for paths. You could get the cwd and then point to a file in a directory down, on Linux you would of course first get the cwd and store it in a variable like `cwd` and then to create the path to the file you would use string interpolation like `$"{cwd}/subdir/file.txt"`. But the `/` symbols are only used in Linux for paths, on Windows the `\\` is used instead so you would need to write `$"{cwd}\\subdir\\file.txt"` instead (`\\` because the backslash is used to escape a character, and the escaped backslash is just a single backslash character).
For this very use-case we use the `get_path` function. You pass in your path created using the string interpolation into the `get_path` function and it gives you back the exact same path, but with all the platform-specific requirements applied to it.

```ft
use Core.print
use Core.system

def main():
    str cwd = get_cwd();
    str path_to_file = get_path($"{cwd}\\subdir\\file.txt");
    print($"path_to_file = {path_to_file}\n");
```

This program will print a line like this to your console:

> ```
> path_to_file = /home/zweiler1/env/flint/flintc/subdir/file.txt
> ```

If you are on Windows the path will look different, of course.
