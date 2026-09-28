# Syntax Highlighting

Syntax highlighting is pretty important for any language. Flint does support syntax highlighting in VSCode and in NeoVim. In this page you will find all necessary information to set up the extensions for both editors.

## VSCode

The VSCode setup is extremely simple. There exists an extension for Flint on the VSCode and OpenVSX marketplaces. You just need to search for **Flint Language Server** and install it, and you are done. You also could download and install the `.vsix` extension from the [latest](https://github.com/flint-lang/vscode-extension/releases) release manually if you want to.

The syntax highlighting now should work correctly and should identify `.ft` files to  be Flint files. That's all you need to do to get Flint syntax highlighting in VSCode.

## NeoVim

For NeoVim, Lazy as the package manager is assumed for this installation guide here. If you use any other manager, just have a look at the extension itself over at [flint-lang/flint-syntax.nvim](https://github.com/flint-lang/flint-syntax.nvim). It's a pretty simple extension so you will not have much problems installing it.

If you are using Lazy as your package manager in NeoVim, the setup is dead simple. In your `setup` of Lazy you just need to add these lines:

```lua
require('lazy').setup({
  -- ...
  {
    'flint-lang/flint-syntax.nvim',
    ft = 'flint',
  },
  -- ...
})
```

to your `init.lua` file. That's it, you do not need to add anything else to get syntax highlighting working for NeoVim.

## Zed

Flint now also has syntax-highlighting support for the Zed editor. To install it you first need to install `rustup` with your favourite package manager regardless of platform, then execute

```sh
rustup target add wasm32-wasip2 
```

and then you need to clone the [https://github.com/flint-lang/flint-zed](https://github.com/flint-lang/flint-zed) extension to a directory of your choice. Then open Zed, press `Ctrl+Shift+X` to open the command palette and search for `Install Dev Extension` and naviage to the cloned repository. It then will compile and install the extension on your system.
