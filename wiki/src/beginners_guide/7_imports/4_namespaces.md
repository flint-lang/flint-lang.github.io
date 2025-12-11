# Namespaces

Let's get to the last chapter of imports, namespaces. As described ealier, a *file* is a namespace, but let's first think about what a namespace even is. A namespace is essentially nothing more than a collection of global and private symbols. Understanding how namespaces work in Flint will greatly improve your understanding of Flint's import system as a whole.

## Sections

A section is a segment of a namespace and there do exist multiple different sections in each namespace:

- A **public** section
- A **private** section
- An **alias** section

Let's start with the simplest section first, the **public** section. Every single type or function you define within a file will land in the public section of that file's namespace. Think of this section as all the things visible to others. If you import a file, say file `B.ft` within another file, like file `A.ft` then within file `A` you will be able to access all types and functions, all definitions, of file `B`. You will be able to access all public definitions of the file.

The **private** section is exclusively filled with the **public** definitions of imported files. In the above example, all **public** definions of file `B.ft` are put into the **private** section of file `A.ft` when importing. This ensures that file `A.ft` has access to all the symbols of it's imported files, and ensures that every file which imports file `A` will only get it's **public** definitions, not all it's private (imported) ones. If every file importing `A` would also gain access to it's **private** symbols then the inclusion depth of 1 would be broken, and circular dependencies would become a problem again.

If you import a file through an alias then something special happens: The definitions of the imported file are **not** put into the private section of the file. You are no longer able to use the imported types and functions directly, you need to call / use them through an alias instead. The aliased import, the use clausel itself, is then put into the **alias** section of the file. In this section are all aliases of the file defined. It needs to be a different section, because the aliases should not be put into the private section of a file when importing it. This special section for the aliases allows the alias chains to work as seemless as they do now. This way you can make clear that "I only care about the content of this file" or "I also care about the aliases of that file".

## Example

If you define an entry point for your library, for example, it could look something like this:

```ft
use "math.ft" as math
use "physics.ft" as phys
use "rendering.ft" as render
...
```

and then the user of the library (or you for yourself) could just write:

```ft
use "lib.ft" as lib

def main():
    // later on:
    lib.math.calculate_something();
    lib.render.render_something();
    ...
```

Import aliasing and chaining aliases makes these patterns possible, and you can now pull in an entire sub-tree of files by just including one file with an alias. If you would include `lib.ft` without an alias in this case then you would not gain access to any of the sub-namespaces at all.

