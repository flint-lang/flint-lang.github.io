# Installation

You first need to download the `flintc` binary from the [Releases](https://github.com/flint-lang/flintc/releases) page of the `flintc` repository or use the installer script if you are on Windows.

## Linux

To make the Flint compiler available from any path in your terminal, and to make it executable through just calling `flintc` in your terminal, you need to copy the `flintc` executable into the `$HOME/.local/bin/` directory and you need to ensure it is marked as executable with this command:

To make the Flint compiler available from any path in your terminal, and to make it executable through just calling `flintc` in your terminal, you need to copy the `flintc` executable into the `$HOME/.local/bin/` directory (if it does not exist yet, i would highly recommend to create it) and you need to ensure it is marked as executable with this command:

```sh
chmod +x $HOME/.local/bin/flintc
```

After adding the `flintc` binary to the `$HOME/.local/bin` directory you should edit your `$HOME/.bashrc` file and ensure it contains the line

```sh
PATH="$PATH:$HOME/.local/bin"
```

And then you can simply use the compiler from any terminal like so:

```sh
flintc --help
```

You need `base-devel` (Arch) or `build-essential` (Ubuntu) in order for the Flint compiler to be able to compile any program. It needs the `crt1.o`, `crti.o` and `crtn.o` files available to it.

### Windows

Installation on Windows is pretty easy, it's just a one-line command:

```ps1
powershell -NoProfile -ExecutionPolicy Bypass -Command "iex (irm 'https://github.com/flint-lang/flint/releases/download/installer/flint_installer.ps1')"
```

Or if this one-liner scares you you can still [download](https://github.com/flint-lang/flint/releases/download/installer/flint_installer.ps1) the installer directly and execute the downloaded script using the command

```ps1
PowerShell -NoProfile -ExecutionPolicy Bypass -File .\flint_installer.ps1
```

The installer will always download the latest Flint release directly and add a wrapper command for it to always point at the correct latest compiler version. You can then use the compiler using

```ps1
flintc.cmd --help
```

directly in any PowerShell. Note that the `flintc.cmd` command is only available in PowerShell, not in the command prompt.
