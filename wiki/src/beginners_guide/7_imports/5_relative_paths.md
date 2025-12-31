# Relative Paths

Flint only supports relative paths when importing files with the `use` clausel. This means that you can import files located in subdirectories too, for example:

File `subdir/file.ft`:

```ft
use Core.print

def hello_from_file():
    print("Hello from file!\n");
```

File `main.ft`:

```ft
use "subdir/file.ft"

def main():
    hello_from_file();
```

This program will print this line to the console:

> ```
> Hello from file!
> ```

## Going up directories

This means you can always go **down** into subdirectories, but how do you go up? Well it's like Unix paths essentially, using `..`. Let's say your `main.ft` now is inside the `subdir` and the `file.ft` is in the top-level:

File `file.ft`

```ft
use Core.print

def hello_from_file():
    print("Hello from file!\n");
```

File `subdir/main.ft`

```ft
use "../file.ft"

def main():
    hello_from_file();
```

And you then compile the program with the command

```sh
flintc -f subdir/main.ft
```

This program will print this line to he console:

> ```
> Hello from file!
> ```

## Exiting the cwd is considered an error

Okay, let's use the exact same files as with the previous example, but this time we change the current working directory to be inside the `subdir` instead. We then try to compile the program with this command:

```sh
flintc -f main.ft
```

We will then get this compilation error (the `VERSION` will be the compiler version in use, like `v0.3.0-core` for example):

> ```
> Parse Error at main.ft:1:5
> └─┬┤E0000│
> 1 │ use "../file.ft"
> ┌─┴─────┘
> ├─ The import tried to escape the current working directory of the compiler
> ├─ If you really need to reference a file outside this working directory, move up a directory
> ├─ Only files within the current working directory are allowed to be accessed by the compiler
> └─ See https://flint-lang.github.io/VERSION/beginners_guide/7_imports/5_relative_paths.html#exiting-the-cwd-is-considered-an-error for more information
> ```

And you now might ask... why? The short answer: security. The long answer is still security but a bit more nuanced. When you have a project then you will have all your actual source code most likely located in the `src` subdirectory of your project with other stuff of the project in other directories. The source directory, the directory where the `.git` folder is located at, will then most likely be the directory from where you will execute your compiler. You will, however, be unlikely to execute the compiler in a directory above.

Okay let's start a bit different first and let's look at a theoretical project structure:

```
projects
 ├─ main_project
 │  └─ main.ft
 └─ lib_project
    └─ lib.ft
```

In this hypothetical file structure you have a directory containing your projects and one of the projects has a dependency to another project, the `main.ft` may look like this:

```ft
use Core.print

use "../lib_project/lib.ft"

def main():
    lib_fn();
```

It is not important what the `lib_project` actually contains for this demonstration, we just say it contains the function `lib_fn` which we need to call from within our main project. Okay so what happens if you `cd` into your `main_project` and execute the compiler, and what *should* happen? We know that the compiler will crash because through the `..` we referenced a directory outside the current working directory of the compiler invocation itself, so we went "outside of our project scope". If you really would need a project structure like above then you would need to change directory to the `projects` directory for the program to even compile.

This is extremely annoying, and this is on porpuse. Let's now say you send your cool project to someone, or host it on GitHub, or things like that. If the other person downloading your project tries to compile it the compiler will immediately fail since the main file references code outside the project. Let's think about what would happen if the compiler would not check this: The compiler will try to find the `../lib_project` directory and the person downloading the project might not have this downloaded, or it might be in another directory. So, even if the compiler would did not check this case, it might fail on the user anyways. This check exists for the developer as a constant reminder that they need to fix their project structure, maybe by integrating the `lib_project` as a git submodule or maybe by simply integrating external code into the project itself.

This simple rule aims at constantly annoying the programmer to fix their dependencies, and I am totally fine regarding annoyance with a clear purpose. So, if you see this error the next time, maybe do not rage about the compiler but think about how you can solve your broken dependencies.
