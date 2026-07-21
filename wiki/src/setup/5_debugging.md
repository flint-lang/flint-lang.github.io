# Debugging

When compiling a Flint project with the default flags, like `flintc main.ft` then the compiler already is in **debug mode**. This means that the compiler emits **debug symbols**, for line-stepping, value inspection, breakpoints etc. How debuggers work or how you can debug a program will not be explained here. Just search online for "how to debug C" (or any compiled langauge), the workflow is the *exact* same.

If you do not want debug symbols you need to change the `--optimize` / `-O` flag, for example `flintc main.ft -O fast`. In any mode other than `debug`, no debug informations are emitted.

## VSCode

If you are debuggin in `VSCode`, make sure to have the `C/C++ Extension Pack` installed. You need to set the `"type":` field in the `launch.json` to `cppdbg` when debugging Flint programs. This is because the debug symbols rely on debug expression evaluation, which does not seem to work in clang, so `lldb` does work for debugging itself, but the values on display might be missing, empty or have weird content shown, so it is recommended to use `cppdbg` as the debug adapter instead.
