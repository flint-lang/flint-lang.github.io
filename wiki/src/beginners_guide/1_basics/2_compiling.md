# Compiling the Program

Save the code from the previous chapter into a file named `hello.ft`. `ft` is the file extension for `Flint` source files. They only contain code in written form. Its then the resposibility of the Flint compiler to take a file containing its source code and creating an executable from it.

To compile the `.ft` file to an executable file, we call

```sh
flintc --file hello.ft --out hello
```

This will output the executable in the current working directory. It can be exexuted with the command

```sh
./hello
```

And now you should see the output of the previous chapter in the console!
