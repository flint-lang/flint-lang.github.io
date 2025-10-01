# Syntax Highlighting

Syntax highlighting is pretty important for any language. Flint does support syntax highlighting in VSCode and in NeoVim. In this page you will find all necessary information to set up the extensions for both editors.

## VSCode

The VSCode setup is extremely simple. You just need to download the [latest](https://github.com/flint-lang/vscode-extension/releases) `.vsix` extension file from the release page of the `vscode-extension` repository. Note that the vsix is called `flint-lsp-X.X.X.vsix`. The same extension handles both LSP and syntax highlighting, but for now we only care about syntax highlighting.

With the downloaded `.vsix` file you need to navigate to the **Extensions** page (Ctrl+Shift+X). Then on the top right of the extensions page you need to click the three dots to open the **Views and More Actions...** options menu and in this menu you need to select **Install from VSIX...**. It should be the last option in this list. Then navigate to your just downloaded `.vsix` file, select it and click **Install**.

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
    config = function()
      vim.cmd [[
          augroup flint_indent
            autocmd!
            autocmd FileType flint setlocal tabstop=4 shiftwidth=4 noexpandtab
          augroup END
      ]]
    end,
  },
  -- ...
})
```

to your `init.lua` file. That's it, you do not need to add anything else to get syntax highlighting working for NeoVim.
