# Core Modules

Core Modules are essential to Flint, as Flint does not ship with a standard library. Core Modules provide core functionality which just **cannot** be implemented in pure Flint code, as Flint is a high level language. The general rule of thumb is that **everything that can be implemented in pure Flint code will not be part of Core Modules**. In Flint, we aim to provide libraries over on FlintHub and aim to make it as easy as possible to include FlintHub libraries. These libraries are the place where "standard" libraries can be found.

You have actually seen the core modules in action quite a lot until now: The `use Core.print` line is a special use clausel which tells the compiler to include the `print` Core module. There are several more core modules than just the `print` module, though. In this chapter, you will learn which Core modules there exist, which functions they provide and how to use them.
