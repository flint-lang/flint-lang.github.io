# Imports

Up until now, we have always worked with one single file, and with a small file too. But a project that only contains a sinlge file is extremely limiting in what you can do with it and it quickly becomes very messy and confusing if you only have one very large file in which everything is defined in.

For this very reason, Flint supports multi-file projects. Unlike languages like C or C++, where you manually need to collect all your translation units when compiling, Flint provides a much clearer experience: You only specify the file which contains your `main` function and `flintc` will dynamically discover all included files, build its internal dependency tree and compile your project from this one and single entry point. So, you can compile your programs with the Flint compiler the same way you did until now, support for multi-file projects does not make compilation any harder for you.


