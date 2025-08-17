# Import Aliasing

<div class="warning">

Import aliasing works, but is messed up.

Use Import aliasing with caution, its pretty messed up at the moment, so it would be best to avoid it for the current version of Flint.

</div>

Import aliasing is pretty useful if you have a lot of files in your project and if you have colliding definition names between your files, or imported libraries. For this very reason you can use import-aliasing, to make definitions from different files unambigue. Here is a small example of this:

The `utils.ft` file:

```ft
use Core.print as p

def print(str msg):
    p.print(msg + "\n");
```

The `main.ft` file:

```ft
use "utils.ft"

def main():
    print("Hello, World!");
```

This program will print this line to the console:

> ```
> Hello, Word!
> ```

As you can see, **any** `use` clausel can be aliased. The identifier after the `as` keyword is the aliasing name, which you need to specify when you call the function. If you would remove the `p.` in the `utils.ft` file you would get a compile error.
