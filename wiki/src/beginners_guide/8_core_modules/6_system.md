# system

```ft
use Core.system
```

The `system` module provides functions to interact with the system, for example to execute system commands.

|     Function Name   | Parameter Types | Return Types | Possible Errors |
| ------------------: | :-------------: | :----------: | :-------------: |
|  `system_command`   |      `str`      | `i32`, `str` |   `ErrSystem`   |
|     `get_cwd`       |       No        |    `str`     |       No        |
|     `get_path`      |      `str`      |    `str`     |       No        |
|  `start_capture`    |       No        |     No       |       No        |
|   `end_capture`     |       No        |    `str`     |       No        |
| `end_capture_lines` |       No        |   `str[]`    |       No        |

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

### start_capture

The `start_capture` function starts capturing the stdout. This means that nothing printed after the `start_capture` function will be printed to the console, but is being collected in a buffer and then we need to call the `end_capture` function to get everything which has been captured. There is no example of `start_capture` which could be shown without the `end_capture` function, so you will find the example there.

### end_capture

The `end_capture` function ends capturing stdout and returns the up-to-that-point captured output as a simple string.

```ft
use Core.print
use Core.system

def main():
	start_capture();
	for (i, _) in 0..10:
		print($"i = {i}\n");
	str captured = end_capture();
	print($"captured = '{captured}'\n");
```

This program will print these lines to the console:

> ```
> captured = 'i = 0
> i = 1
> i = 2
> i = 3
> i = 4
> i = 5
> i = 6
> i = 7
> i = 8
> i = 9
> '
> ```

### end_capture_lines

The `end_capture_lines` function is essentially the same as the `end_capture` function with the only difference that the buffer string is split at all `\n` characters, meaning the `end_capture_lines` function returns a `str[]` where each element of the array is a single line which has been printed to the console.

```ft
use Core.print
use Core.system

def main():
	start_capture();
	for (i, _) in 0..10:
		print($"i = {i}\n");
	str[] captured_lines = end_capture_lines();
	for (i, line) in captured_lines:
		print($"line[{i}]: {line}\n");
```

This program will print these lines to the console:

> ```
> line[0]: i = 0
> line[1]: i = 1
> line[2]: i = 2
> line[3]: i = 3
> line[4]: i = 4
> line[5]: i = 5
> line[6]: i = 6
> line[7]: i = 7
> line[8]: i = 8
> line[9]: i = 9
> ```
