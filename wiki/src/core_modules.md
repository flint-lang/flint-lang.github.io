# Core Modules

Core Modules are essential to Flint, as Flint does not yet ship with a standard library. Core Modules provide core functionality which just **cannot** be implemented in pure Flint code, as Flint is a high level language. The general rule of thumb is that **everything that can be implemented in pure Flint code will not be part of Core Modules**. The idea is that the Core Modules will be as minimal as possible, with all higher-level types, operations and wrappers becoming part of the standard library.
