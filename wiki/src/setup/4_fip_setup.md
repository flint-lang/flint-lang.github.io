# FIP Setup

## Linux

### Arch

The Flint packages have been published to the AUR. The PKGBUILD is just a small wrapper which downloads the correct binary and puts it into the right path (`/usr/bin/`). To download and install the `fip-c-bin` package with the AUR helper of your choice:

```sh
paru -Sy fip-c-bin
```

You may need to restart your shell for the binary to become available after installation.

### Fedora

The Flint packages have been published to a COPR repository. To install the C Interop Module you first need to add the COPR repository to dnf and then you can install the package:

```sh
sudo dnf copr enable zweiler1/fip-c
sudo dnf install fip-c
```

You may need to restart your shell for the binary to become available after installation.

### Nixpkgs

The C Interop Module, just like the main compiler, is still a [work in progress](https://github.com/NixOS/nixpkgs/pull/530494) to get published on `nixpkgs`, use manual installation for now.

### Ubuntu

The C Interop Module has been published to [launchpad](https://launchpad.net/~zweiler1/+archive/ubuntu/flint). You can install it with these commands:

```sh
sudo apt install fip-c
```

### Manual Installation

Download the `fip-c` binary from the [Releases](https://github.com/flint-lang/fip/releases) page of the `fip` repository. When executing `flintc --version` you should see the `Flint Interop Protocol` version printed in there. You need to grab the Interop Modules which match that version.

Once you have downloaded the `fip-c` binary simply put it in a directory which is available to the `$PATH` variable, it is recommended to put it to the `flintc` into the `$HOME/.local/bin/` directory. Then make sure that the binary is executable with `chmod +x $HOME/.local/bin/fip-c` and you are good to go.

## Windows

### Winget

```ps1
winget install Flint.Fip-C
```

### Manual Installation

Download the `fip-c.exe` executable from the [Releases](https://github.com/flint-lang/fip/releases) page of the `fip` repository. When executing `flintc --version` you should see the `Flint Interop Protocol` version printed in there. You need to grab the Interop Modules which match that version.

You need to make sure that the `fip-c.exe` file is contained in a directory which is added to the `%PATH%` variable of Windows. It's recommended to put it into the `%LOCALAPPDATA%\Flint` directory, since this directory has been added to the `%PATH%` variable already if you installed Flint using the installer.
