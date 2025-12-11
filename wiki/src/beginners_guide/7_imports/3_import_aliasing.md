# Import Aliasing

Import aliasing is pretty useful if you have a lot of files in your project and if you have colliding definition names between your files, or imported libraries. For this very reason you can use import-aliasing, to make definitions from different files unambigue. Here is a small example of this:

## Simple alias

The `add.ft` file:

```ft
def add(i32 x, i32 y) -> i32:
    return x + y;
```

The `utils.ft` file:

```ft
use Core.print

use "add.ft" as a

def add(i32 x, i32 y) -> i32:
    print($"{x} + {y} = {a.add(x, y)}\n");
    return a.add(x, y);
```

The `main.ft` file:

```ft
use Core.print

use "utils.ft"

def main():
    i32 res = add(10, 20);
    print($"res = {res}\n");
```

This program will print this line to the console:

> ```
> 10 + 20 = 30
> res = 30
> ```

As you can see, **any** `use` clausel can be aliased. The identifier after the `as` keyword is the aliasing name, which you need to specify when you call the function. If you would remove the `p.` in the `utils.ft` file you would get a compile error.

## Alias chain

Let's try something else, let's import the `utils.ft` file using an alias too, as then something cool happens, have a look:

The `add.ft` and `utils.ft` files stayed the exact same.

The `main.ft` file:

```ft
use Core.print

use "utils.ft" as u

def main():
    i32 res = u.a.add(10, 20);
    print($"res = {res}\n");
```

This program will print these lines to the console:

> ```
> res = 30
> ```

As you can see, we now skipped the function `add` defined in the `utils.ft` file entirely and called the `add` function from `add.ft` directly! This is a very important characteristic of import aliasing: The aliased import becomes part of the global symbols of the file namespace and can be used in files importing it. But if you remove the `as u` alias in the `main.ft` then you will *not* be able to access the alias `a` at all! You are only allowed to access a file's aliases when accessing the file through an alias itself. You will understand how it all works and why it works like it does shortly.

## Aliased types

Just like functions can used with an alias, types can too:

file `data.ft`

```ft
data Vec3:
    f32 x;
    f32 y;
    f32 z;
    Vec3(x, y, z);

def add(mut Vec3 v1, Vec3 v2):
    v1.(x, y, z) += v2.(x, y, z);
```

file `main.ft`

```ft
use Core.print

use "data.ft" as d

def main():
    d.Vec3 v3 = d.Vec3(10.0, 20.0, 30.0);
    d.add(v3, d.Vec3(5.0, 5.0, 5.0));
    print($"v3 = ({v3.x}, {v3.y}, {v3.z})\n");
```

This program will print this line to the console:

> ```
> v3 = (15.0, 25.0, 35.0)
> ```

<div class="warning">

The output differs in the current version of the compiler

As with other places when printing floating point values, the output differs in the current version of the compiler. The above output is the correct output, but currently the output looks like this instead:

> ```
> v3 = (15, 25, 35)
> ```

So, if you see the above output, do not worry, it will be fixed in some later release!

</div>

## Side note

You are not allowed to ever alias a `Core` module import. Core modules need to be written out explicitely in every file using them. There does not exist a true technical limitation for this, it's a deliberate desgin choice to make dependencies on `Core` modules explicit and easily visible. You may have seen this pattern already, but it is recommended to put all `Core` module imports at the very top of the file, before any other file imports or function definitions.
