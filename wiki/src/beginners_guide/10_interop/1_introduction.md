# Introduction

We still need to cover the basics and a bit of internals of the FIP (Flint Interop Protocol) here, especially **what** it is. The FIP is, as it's name suggests, is a protocol for interoperability. The base idea is very simple: Flint handles *all* extern code as a black box and communicates with separate Interop Modules over the FIP to find out who provides a given function. It's essentially a communication pipeline, similar to a phone line. But let's start at the beginning.

FIP is a small, extensible IPC protocol between the Flint Compiler (the **master**) and one or more **Interop Modules** (IMs). Each IM is a helper program that understands a specific language (for example `fip-c` for C). The compiler asks IMs for symbol information, asks them to compile/produce objects, and receives responses back. Treat the IMs as language-specific assistants: Flint does not try to parse, compile or understand every language by itself — it asks the IMs to do the language work and then consumes the results.

Key properties you can rely on:

- **Master / IM separation**: The Flint compiler is the master. IMs are external processes specialized per language; the master talks to them over FIP messages (stdio communication)
- **Extensible by language**: Each IM knows its own language, nothing more. `fip-c` is the C IM and it only understands C code; other IMs can be added for other languages
- **Config-driven**: Each IM is configured by its own TOML file (e.g. `fip-c.toml`) and the project-level `.fip` directory stores cache and metadata.
- **Object outputs**: IMs can compile sources code and return object files that the compiler links into the final binary. This keeps debug info intact and makes stepping into native code possible from a debugger.
- **Binding-less usage**: Because IMs can parse headers and produce objects, you can call C code from Flint without ever hand-writing bindings.

In this chapter you will learn how to configure and use the FIP effectively. So, let's dive straight in, shall we?
