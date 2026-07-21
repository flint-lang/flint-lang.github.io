# Installation

## Linux

The Flint language packages are published to *some* package managers on Linux, but they are all statically compiled binaries, so manual installation is not that hard either.

### Arch

The Flint packages have been published to the AUR. The PKGBUILD is just a small wrapper which downloads the correct binary and puts it into the right path (`/usr/bin/`). To download and install the `flintc-bin` package with the AUR helper of your choice:

```sh
paru -Sy flintc-bin
```

You may need to restart your shell for the binary to become available after installation.

### Fedora

The Flint packages have been published to a COPR repository. To install the Flint compiler you first need to add the COPR repository to dnf and then you can install the package:

```sh
sudo dnf copr enable zweiler1/flintc
sudo dnf install flintc
```

You may need to restart your shell for the binary to become available after installation.

### Nixpkgs

The Flint compiler is still a [work in progress](https://github.com/NixOS/nixpkgs/pull/530494) to get published on `nixpkgs`, use manual installation for now.

### Ubuntu

I simply cannot publish anything on [Launchpad](https://launchpad.net/ubuntu) since I never recieve the verification E-Mail, no matter what I try. I would appreciate some help if you have some experience with launching packages on Launchpad.

### Manual installation

You first need to download the `flintc` binary from the [Releases](https://github.com/flint-lang/flintc/releases) page of the `flintc` repository or use the installer script if you are on Windows.

To make the Flint compiler available from any path in your terminal, and to make it executable through just calling `flintc` in your terminal, you need to copy the `flintc` executable into the `$HOME/.local/bin/` directory and you need to ensure it is marked as executable with this command:

To make the Flint compiler available from any path in your terminal, and to make it executable through just calling `flintc` in your terminal, you need to copy the `flintc` executable into the `$HOME/.local/bin/` directory (if it does not exist yet, i would highly recommend to create it) and you need to ensure it is marked as executable with this command:

```sh
chmod +x "$HOME/.local/bin/flintc"
```

After adding the `flintc` binary to the `$HOME/.local/bin` directory you should edit your `$HOME/.bashrc` file and ensure it contains the line

```sh
PATH="$PATH:$HOME/.local/bin"
```

And then you can simply use the compiler from any terminal like so:

```sh
flintc --help
```

You need the `base-devel` (Arch) or `build-essential` (Ubuntu) packages installed in order for the Flint compiler to be able to compile any program. It needs the `crt1.o`, `crti.o` and `crtn.o` lib files available to it.

## Windows

You can either install the Flint compiler using `winget` or install it manually.

### Winget

The Flint packages have been published on the winget repository, which makes installing them very easy on Windows:

```ps1
winget install Flint.Flintc
```

You may need to restart your shell for the executable to become available after installation.

### Manual installation

"Manual" installation is to use the old one-line install method I had before pushing the packages to Winget:

```ps1
powershell -NoProfile -ExecutionPolicy Bypass -Command "iex (irm 'https://github.com/flint-lang/flint/releases/download/installer/flint_installer.ps1')"
```

Or if this one-liner scares you you can still [download](https://github.com/flint-lang/flint/releases/download/installer/flint_installer.ps1) the installer directly and execute the downloaded script using the command

```ps1
PowerShell -NoProfile -ExecutionPolicy Bypass -File .\flint_installer.ps1
```

The installer will always download the latest Flint release directly and add it to your path variable. You can then use the compiler using

```ps1
flintc --help
```

directly in any PowerShell or CommandPrompt. The executable is available in every directory you are in. A restart may be required.
