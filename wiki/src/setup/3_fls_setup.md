# Language Server Setup

## Installation

### Linux

If you installed the `flintc` package with a package manager, the `fls` package will already be installed, as those two are bundled inside one package.

#### Manual Installation

Installation of the `fls` is pretty easy on Linux. It's essenially the same as the `flintc` setup. Download the `fls` binary from the [Releases](https://github.com/flint-lang/flintc/releases) page of the `flintc` repository and put the `fls` binary into the `.local/bin` directory, just like you did for the `flintc` compiler. Make it executable using `chmod +x $HOME/.local/bin/fls` and then you should be up and running.

### Windows

#### Winget

```ps1
winget install Flint.Fls
```

#### Manual Installation

The installation script of the [first](./1_installation.md.md) page already installed the `fls` system wide on Windows, so you don't need to change anything for it to work.

## Editor Setup

### VSCode

If you have the VSCode extension installed (described in the [previous](./syntax_highlighting.md) page) then you already have everything set up. Everything should just work™.

### NeoVim

If you enabled the package from the [previous](./syntax_highlighting.md) page, the langauge server should also just work correctly.
