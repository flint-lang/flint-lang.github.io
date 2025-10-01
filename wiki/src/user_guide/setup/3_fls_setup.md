# Language Server Setup

The `fls` (Flint Language Server) setup is pretty straight forward too.

## Linux

Installation of the `fls` is pretty easy on Linux. It's essenially the same as the `flintc` setup. Download the `fls` binary from the [Releases](https://github.com/flint-lang/flintc/releases) page of the `flintc` repository and put the `fls` binary into the `.local/bin` directory, just like you did for the `flintc` compiler. Make it executable using `chmod +x $HOME/.local/bin/fls` and then you should be up and running.

## Windows

Installation of the `fls` is pretty easy on Windows too, alltough it is a bit harder than on Linux. Like Linux, just download thee `fls.exe` file from the [Releases](https://github.com/flint-lang/flintc/releases) page of the `flintc` repository. And then you have two options: Either you ensure that the executable is in your `PATH` variable or you just put it anywhere you want. It is recommended to execute `flintc.cmd --print-bin-path`, it will give you the path where the `flintc.exe` is contained in. It should be something like `%LOCALAPPDATA\Flint\Versions\v0.2.3-core\flintc.exe`. It is recommended to put the `fls.exe` file into the same directory as your `flintc.exe`, to more easily keep track of versions.

## VSCode

If you have the VSCode extension installed (described in the [previous](./syntax_highlighting.md) page) then you already have everything set up editor-wise.

On Windows you additionaly need to go into the settings page of the extension. You will find a toggle to enable the language server and a path to the binary there. The path has the default value of `fls`. If your `fls.exe` is inside your `PATH` variable then you just need to change it from `fls` to `fls.exe`. If you just copied it to the directory where `flintc.exe` is contained at, then you must write the path to the file in there. If you just copy the path, something like `C:\\Users\zweiler1\AppData\Local\Flint\Versions\v0.2.3-core\fls.exe` then you need to ensure to escape all backslashes of the path, so you would need to change all `\` to `\\`. Also, make sure that the path is not surrounded by `"` characters, they are not needed for the option.

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

If you are on Windows, you need to make sure that the `cmd` is set to `fls.exe` or that it's value is the absolute path to the executable, like above in the VSCode setup.

That's it, you now should now have LSP support in your neovim setup. This assumes that you already have `lspconfig` installed in NeoVim. If you have used the [kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim) repository as a basis for your own configuration (highly recommended) then it should already be installed and ready to be used.
