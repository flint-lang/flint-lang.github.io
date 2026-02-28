# Setup

This is the setup chapter for the `flintc` project. In this chapter you will find all information regarding building the `flintc` compiler itself.

## Prequisites

The `flintc` project uses the `Zig` build system as it's build system of choice, this means that you need Zig installed on your system to be able to build the Flint compiler.

- Zig
- `lld` (Zig does not provide `lld` itself)
- CMake (to build LLVM)
- Ninja (to build LLVM)
- Python (>3.8, to build LLVM)

## Linux

On Linux you need to install the packages via your package manager of choice and then it should be smooth sailing with the command `zig build`.

## Windows

On Windows it is recommended to simpy use `winget` to install all the required dependencies:

- `zig.zig` for Zig itself
- `MartinStorsjo.LLVM-MinGW.UCRT` to get `ld.lld` since Zig does not ship it, and to get the C++ `std` library headers (`<string>`, etc)
- `CMake`
- `Ninja-build.Ninja`
- `python3`

The full installation command to install all dependencies with one command:

```ps1
winget install zig.zig MartinStorsjo.LLVM-MinGW.UCRT CMake Ninja-build.Ninja python3
```

After that you should have all C++ stl header libraries installed on your system, there is no need to install anything related to Visual Studio on the system. After all these packages are installed you can simply execute `zig build` to compile the Flint compiler.

Compiling LLVM itself for the first time could take up to an hour, it takes quite a lot of time, be aware of that. After the initial build the `flintc` directory takes up roughly 10GB of storage space, so be aware that LLVM needs a lot of space.

<div class="warning">

I was not able to get `neovim` to work properly on Windows

It did not like the installed standard library from the above mentioned minimal llvm-mingw package. `Zed`, however, worked fine so it now is the recommended IDE to use on Windows. I still need to figure out why nvim doesn't work on Windows, i would much rather use it instead of Zed but hey, we can't get everything.

</div>

## After Compilation

After compiling the compiler you need the `glibc` (or `musl`) package installed in order for the Flint compiler to be able to compile any program. This is because it needs the `crt1.o`, `crti.o` and `crtn.o` files available in your lib path.
