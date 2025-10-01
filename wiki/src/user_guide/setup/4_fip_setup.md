# FIP Setup

To installation of any FIP module is very simple, both on Linux and on Windows. First of all, you will need to grab your binary, like `fip-c` (or `fip-c.exe`) from the [Releases](https://github.com/flint-lang/fip/releases) page of the `fip` repository. When executing `flintc --version` you should see the `Flint Interop Protocol` version printed in there. You need to grab the Interop Modules of that version.

## Linux

Once you have downloaded the `fip-c` binary you need to put it into the `$HOME/.local/fip/modules` directory and with that the setup is complete. The binary **needs** to be present in that directory, you cannot put it anywhere else.

## Windows

Once you downloaded the `fip-c.exe` executable you can simply put it into the `%LOCALAPPDATA%/fip/modules` directory. Once you have done that, the setup of the `fip-c` Interop Module (or any FIP IM) is complete.
