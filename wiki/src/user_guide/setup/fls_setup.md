# Language Server Setup

The `fls` (Flint Language Server) setup is pretty straight forward too.

## Linux

Installation of the `fls` is pretty easy on Linux. It's essenially the same as the `flintc` setup. Download the `fls` binary from the [Releases](https://github.com/flint-lang/flintc/releases) page of the `flintc` repository and put the `fls` binary into the `.local/bin` directory, just like you did for the `flintc` compiler. Make it executable using `chmod +x $HOME/.local/bin/fls` and then you should be up and running.

## Windows

The `fls` does not work on Windows yet.

## VSCode

If you have the VSCode extension installed (described in the [previous](./syntax_highlighting.md) page) then you already have everything set up editor-wise.

## NeoVim

To enable LSP support for the NeoVim extension you need to edit the `syntax-highlight.nvim` setup in your `init.lua` file. You need to add a few lines to the setup, the complete setup should look like this:

```lua
require('lazy').setup({
  -- ...
  {
    'flint-lang/flint-syntax.nvim',
    ft = 'flint',
    config = function()
      -- Set the tab width to 4
      vim.cmd [[
          augroup flint_indent
            autocmd!
            autocmd FileType flint setlocal tabstop=4 shiftwidth=4 noexpandtab
          augroup END
      ]]

      -- LSP configuration
      local lspconfig = require 'lspconfig'
      local configs = require 'lspconfig.configs'

      -- Define flint LSP if not already defined
      if not configs.flint then
        configs.flint = {
          default_config = {
            cmd = { 'fls' }, -- Make sure this is in your PATH
            filetypes = { 'flint' },
            root_dir = function(fname)
              return lspconfig.util.find_git_ancestor(fname) or vim.fn.getcwd()
            end,
            settings = {},
          },
          docs = {
            description = [[
Flint Language Server Protocol implementation.
Make sure 'fls' is in your PATH.
            ]],
          },
        }
      end

      -- Setup the LSP
      lspconfig.flint.setup {}
    end,
  },
  -- ...
})
```

That's it, you now should now have LSP support in your neovim setup. This assumes that you already have `lspconfig` installed in NeoVim. If you have used the [kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim) repository as a basis for your own configuration (highly recommended) then it should already be installed and ready to be used.
