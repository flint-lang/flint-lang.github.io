# FIP Setup

The of any FIP module is very simple, both on Linux and on Windows. First of all, you will need to grab your binary, like `fip-c` (or `fip-c.exe`) from the [Releases](https://github.com/flint-lang/fip/releases) page of the `fip` repository. When executing `flintc --version` you should see the `Flint Interop Protocol` version printed in there. You need to grab the Interop Modules of that version.

## Linux

Once you have downloaded the `fip-c` binary simply put it in a directory which is available to the `$PATH` variable, it is recommended to put it to the `flintc` into the `$HOME/.local/bin/` directory. Then make sure that the binary is executable with `chmod +x $HOME/.local/bin/fip-c` and you are good to go.

## Windows

You need to make sure that the `fip-c.exe` file is contained in a directory which is added to the `%PATH%` variable of Windows. It's recommended to put it into the `%LOCALAPPDATA%\Flint` directory, since this directory has been added to the `%PATH%` variable already if you installed Flint using the installer.
