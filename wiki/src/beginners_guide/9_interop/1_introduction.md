# Introduction

We still need to cover the basics and a bit of internals of the FIP (Flint Interop Protocol) here, especially **what** it is. The FIP is, as its name suggests, is a protocol for interoperability. The base idea is very simple: Flint handles *all* extern code as a black box and communicates with separate Interop Modules (**IM**)) over the FIP to find out who provides a given symbol.

FIP is a small, extensible [IPC](https://en.wikipedia.org/wiki/Inter-process_communication) protocol between the Flint Compiler (the **master**) and one or more **Interop Modules** (IMs). Each IM is a helper program that understands only one specific language very well (for example `fip-c` for C). The compiler asks IMs for symbol information, asks them to compile/produce objects, and receives responses back. Treat the IMs as language-specific assistants: Flint does not try to parse, compile or understand every language by itself, it asks the IMs to do the language work and then consumes the results (object files to link).

The Flint Compiler will also communicates with the IMs about which ABIs they support. For now, every single IM (there only exists `fip-c` yet) uses the C ABI for function calls. But since the FIP is an abstraction over FFI in general, we could have different ABIs for every single extern function you define. For example, function `A` comes from extern C conde while function `B` might come from Rust. As of now, as only the `fip-c` IM exists, this possibility of using FIP for other languages as well is just the general goal of the protocol but it remains to be seen how easy it is to extend it.

Key properties you can rely on:

- **Master / IM separation**: The Flint compiler is the master. IMs are external processes specialized per language; the master talks to them over FIP messages (stdio communication)
- **Extensible by language**: Each IM knows its own language, nothing more. `fip-c` is the C IM and it only understands C code; other IMs can be added for other languages
- **Config-driven**: Each IM is configured by its own TOML configuration file (e.g. `fip-c.toml`) and the project-level `.fip` directory stores cache, metadata and auto-generated "binding" files
- **Object outputs**: IMs can compile sources code and return object files that the compiler links into the final binary. This keeps debug info intact and makes stepping into native code possible from a debugger even in a [polyglot](https://en.wikipedia.org/wiki/Polyglot_(computing)) codebase
- **Binding-less usage**: Because IMs can parse headers and produce objects, it truly *understands* the extern code and as a result you can call C code from Flint without ever hand-writing bindings

In this chapter you will learn how to configure and use the FIP effectively.
