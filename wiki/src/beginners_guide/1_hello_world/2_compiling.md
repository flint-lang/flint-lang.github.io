# Compiling the Program

Save the above code into a file named `hello.ft`. `ft` is the file extension for `Flint` source files. They only contain code in written form.

To compile the `.ft` file to an executable file, we call

```sh
flint compile ./hello.ft -o ./hello
```

This will output the executable in the current working directory. It can be exexuted with the command

```sh
./hello
```
