# filesystem

```ft
use Core.filesystem
```

The `filesystem` module provides several functions to read data from and write data to files.

| Function Name | Parameter Types | Return Types | Possible Errors |
| ------------: | :-------------: | :----------: | :-------------: |
|   `read_file` |      `str`      |    `str`     |     `ErrIO`     |
|  `read_lines` |      `str`      |   `str[]`    |     `ErrFS`     |
| `file_exists` |      `str`      |    `bool`    |       No        |
|  `write_file` |   `str`, `str`  |      No      |     `ErrFS`     |
| `append_file` |   `str`, `str`  |      No      |     `ErrFS`     |
|     `is_file` |      `str`      |    `bool`    |       No        |

## error sets

These are the error sets this Core module provides.

### ErrIO

This error set does not have a parent error, so it directly and only extends `anyerror` directly. These are the possible values this error could have:

| Error Value     | Description                              |
| :-------------- | :--------------------------------------- |
| `OpenFailed`    | Could not open the file                  |
| `NotFound`      | File does not exist                      |
| `NotReadable`   | Exists but is not readable               |
| `NotWritable`   | Exists but is not writable (permissions) |
| `UnexpectedEOF` | Hit EOF in the middle of a read          |

### ErrFS

This error set extens the `ErrIO` error set. These are the possible values this error set could have in addition to all the error values from `ErrIO`:

| Error Value   | Description                |
| :------------ | :------------------------- |
| `TooLarge`    | File is unreasonably large |
| `InvalidPath` | Path string is malformed   |

## functions

These are the functions this Core module provides.

### read_file

The `read_file` function takes a `str` parameter, which is the path to the file that wants to be read and returns a `str` value, containing the content of the given file. This function throws an error if the file does not exist or is not readable.

```ft
use Core.print
use Core.filesystem

def main(str[] args):
    if args.length < 2:
        print("No path provided as a cli argument! Exiting...\n");
        return;

    str file_content = read_file(args[1]);
    print($"Read file '{args[1]}':\n");
    print(file_content);
    print("\n");
```

When executing this program with the command `./main main.ft` we get this output:

> ```
> Read file 'main.ft':
> use Core.print
> use Core.filesystem
>
> def main(str[] args):
>     if args.length < 2:
>         print("No path provided as a cli argument! Exiting...\n");
>         return;
>
>     str file_content = read_file(args[1]);
>     print($"Read file '{args[1]}':\n");
>     print(file_content);
>     print("\n");
> ```

### read_lines

The `read_lines` function reads a given file (the `str` path to the file) and returns an array of all read lines (`str[]`). This function is really useful for reading a file and iterating through each line after reading the file. This function throws an error if the file does not exist or is not readable.

```ft
use Core.print
use Core.filesystem

def main(str[] args):
    if args.length < 2:
        print("No path provided as a cli argument! Exiting...\n");
        return;

    str[] lines = read_lines(args[1]);
    print($"Read file '{args[1]}':\n");
    for (idx, line) in lines:
        print($"{idx}:\t| {line}\n");
```

When executing this program with the command `./main main.ft` we get this output:

> ```
> Read file 'main.ft':
> 0:	| use Core.print
> 1:	| use Core.filesystem
> 2:	|
> 3:	| def main(str[] args):
> 4:	|     if args.length < 2:
> 5:	|         print("No path provided as a cli argument! Exiting...\n");
> 6:	|         return;
> 7:	|
> 8:	|     str[] lines = read_lines(args[1]);
> 9:	|     print($"Read file '{args[1]}':\n");
> 10:	|     for (idx, line) in lines:
> 11:	|         print($"{idx}:\t| {line}\n");
> ```

### file_exists

The `file_exists` function checks whether the given file (`str` path to the file) exists. This function cannot crash, as it checks for a file's existence, so when it does not exist or is not readable, it just returns `false`.

```ft
use Core.print
use Core.filesystem

def main(str[] args):
    if args.length < 2:
        print("No path provided as a cli argument! Exiting...\n");
        return;

    bool exists = file_exists(args[1]);
    print($"Does file '{args[1]}' exist? {exists}\n");
```

When executing this program with the command `./main main.ft` we get this output:

> ```
> Does file 'main.ft' exist? true
> ```

### write_file

The `write_file` function takes two arguments. The first argument is the path to the file to write to (or create) as a `str` path. The second parameter is the content of the to-be-written file (`str`). This function will create a file at the given path if the file does not exist yet. If the file exists, this function just overwrites it. This function will throw an error if the given file coould not be opened or could not be written to (for example a permission error).

```ft
use Core.print
use Core.filesystem

def main():
    write_file("test_file", "Test File content\nThis is going to be great!");
    str file = read_file("test_file");
    print($"test_file content:\n{file}\n");
```

This program will print these lines to the console:

> ```
> test_file content:
> Test File content
> This is going to be great!
> ```

### append_file

The `append_file` function will try to append text to an already existent file. The first parameter of the function is the path to the file the new content is appended (`str` path). The second parameter is the content which will be appended to the file (`str`). This function will throw an error if the given file does not exist or could not be opened with write access.

```ft
use Core.print
use Core.filesystem

def main():
    write_file("test_file", "Test File content\nThis is going to be great!");
    append_file("test_file", "\n\nThis is written with one space in between!");

    str file = read_file("test_file");
    print($"test_file content:\n{file}\n");
```

This program will print these lines to the console:

> ```
> test_file content:
> Test File content
> This is going to be great!
>
> This is written with one space in between!
> ```

### is_file

The `is_file` function checks whether the file at the given path (`str`) even is a file. It will return `false` in the case that the file / directory does not exist. It will also return false if the given "file" is actually a directory. This function cannot throw any errors.

```ft
use Core.print
use Core.filesystem

def main():
    print($"is 'test_file' a file? {is_file("test_file")}\n");
    print($"is 'somegarbage' a file? {is_file("somegarbage")}\n");
```

This program will print these lines to the console:

> ```
> is 'test_file' a file? true
> is 'somegarbage' a file? false
> ```
