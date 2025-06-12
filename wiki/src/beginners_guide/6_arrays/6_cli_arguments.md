# CLI Arguments

CLI Arguments stands for **C**ommand **L**ine **I**nterface Arguments. CLI arguments describe the act of passing in arguments to a program when executing said program, just like executing a function and passing in the arguments to the function. In fact, many programs can be thought of as "functions" in the Linux world, where you pass in data to a function and get something from it in return.

Here is an example of CLI arguments in action:

```rs
use Core.print

def main(str[] args):
    for (idx, elem) in args:
        print($"args[{idx}] = {elem}\n");
```

Note how the **signature** of the main function has changed. The main function is allowed to have a parameter of type `str[]` or to have no parameter. All other cases will lead to an compile error.

This program will print different lines to the console, depending on how we execute it. If we execute the built program (for example the `main` binary) with this command:

```sh
./main
```

we will see this line being printed to the console:

> ```
> args[0] = ./main
> ```

If we execute the program like so:

```sh
./main someargument somethingelse third-thing
```

we will se theese lines being printed to the console instead:

> ```
> args[0] = ./main
> args[1] = someargument
> args[2] = somethingelse
> args[3] = third-thing
> ```

As you can see, the first argument is always the command with which the program was executed with. If the built binary is in a subdirectory, for example, and you execute it with this command:

```sh
./somedirectory/main
```

you will see this line being printed to the console in this case:

> ```
> args[0] = ./somedirectory/main
> ```

So, if you execute a program with the absolute path to said program, the first CLI argument will contain the command used to execute the program.
