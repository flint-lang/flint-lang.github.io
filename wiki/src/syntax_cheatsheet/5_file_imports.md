# File Imports

## The `use` Clause

`use` is a top-level clause (like `type`), **no semicolon**. It imports a module or a file:

```ft
use Core.print
```

## File Imports

Only relative paths are supported. The compiler resolves imports dynamically:

```ft
/* main.ft */

// adds all public definitions of utils.ft
use "utils.ft"

def main():
    // from utils.ft
    i32 res = add(5, 6);
```

```ft
/* utils.ft */
def add(i32 x, i32 y) -> i32:
    return x + y;
```

Subdirectories work too: `use "subdir/file.ft"`.

## Aliasing

```ft
// any use can be aliased, even `use Core.print`
use "add.ft" as a

def add(i32 x, i32 y) -> i32:
    // must qualify through the alias
    return a.add(x, y);
```

Types from aliased files are qualified too:

```ft
use "data.ft" as d

def main():
    d.Vec3 v3 = d.Vec3(10.0, 20.0, 30.0);
```

## Alias Chains

Aliased imports become part of the file's aliases, so they chain:

```ft
/* main.ft */
use "utils.ft" as u

def main():
    // reaches through utils.ft's alias 'a' to add.ft
    u.a.add(10, 20);
```

Without an alias you cannot see another file's aliases, only its public definitions.

## Namespaces

Every file is a namespace with three sections:

- **public**: all definitions in the file; visible to importers.
- **private**: the public definitions of directly imported files (depth-1 visibility).
- **alias**: this file's aliased imports; only reachable if the file itself is imported with an alias.

Include an entire subsystem through one alias:

```ft
use "lib.ft" as lib

def main():
    lib.math.calculate_something();
    lib.render.render_something();
```

## Relative Path Rules

- Go up with `..`: `use "../file.ft"`.
- Escaping the compiler's working directory is an error (by design, for security and reproducibility).
- Circular dependencies between files are allowed.
