# Installation

Installing Flint is really easy. Just download the `flintc` binary for your given platform from the [Releases](https://github.com/flint-lang/flintc/releases) page of the `flintc` repository.

## Linux

To make the Flint compiler available from any path in your terminal, and to make it executable through just calling `flintc` in your terminal, you need to copy the `flintc` executable into the `$HOME/.local/bin/` directory and you need to ensure it is marked as executable with this command:

```sh
chmod +x $HOME/.local/bin/flintc
```

You need `base-devel` (Arch) or `build-essential` (Ubuntu) in order for the Flint compiler to be able to compile any program. It needs the `crt1.o`, `crti.o` and `crtn.o` files available to it.

## Windows

It is actively worked on an installer (`.msi` file) which will download the compiler for you and will set the `PATH` variable accordingly. Until then, the path to the executable (`flintc.exe`) needs to be specified manually when compiling a Flint program.

