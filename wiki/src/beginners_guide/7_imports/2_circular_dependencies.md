# Circular Dependencies

You may have asked yourself already *"What will happen if file `A` imports file `B` and file `B` imports file `A` again?"*. This is called a circular dependency. It's called circular, because the dependency graph forms a circle, where the "line of imports" ends up at its starting point. If you try to write import statements in C where every file imports another file you will get a compilation error, as circular dependencies are not allowed and cannot be resolved.

But Flint's `use` clausels work quite different from the `#import` from C-style languages. Whereas these literally just copy and paste the code from the other file, the `use` clausel in Flint is a lot...smarter. The `use` clausel only imports files at a depth of `1`, but what does this mean? Well, here is a small example to showcase what i mean with that:

The `helper.ft` file:
```rs
def substract_and_mult(i32 x, i32 y) -> i32:
    i32 diff = x - y;
    return diff * 2;
```

The `utils.ft` file:
```rs
use "helper.ft"

def some_operation(i32 x, i32 y) -> i32:
    i32 res = substract_and_mult(x, y);
    return res - (x + y);
```

The `main.ft` file:
```rs
use "utils.ft"
use Core.print

def main():
    i32 res = some_operation(44, 33);
    print($"res = {res}\n");
```

When compiling this program, you will see this line printed to the console:

> ```
> res = -55
> ```

In this example you can see how Flint has an importing depth of `1`, unlike many other languages. So, when you include `utils.ft` in the `main.ft` file you *only* gain access to the `some_operation` function, but *not* to the `substract_and_mult` function from the `helper.ft` file. There is no recursive resolution of imports happening, meaning that **every** import in Flint is "shallow". If you would need the `substract_and_mult` function within your `main.ft` file you would need to write an explicit `use "helper.ft"` clausel. This is absolutely intentional, because having *only* shallow inclusions we get something even better: ***circular inclusion support***.

Circular dependencies are **not** considered a fault in Flint, at all. Often times you want to separate code on meaning, but the single files still need access to one another. In C-style languages you would solve this with forward-declarations, header files etc. But in Flint you just include any file you like, and it simply does not matter if a circle emerges or not, the Flint compiler will handle it all! Here is an example showcasing circular dependencies with a recursive function:

The `utils.ft` file:
```rs
use "main.ft"
use Core.print

def recursive_count_utils(i32 x):
    if x > 5:
        print("utils end\n");
        return;
    print($"utils: {x}\n");
    recursive_count_main(x + 1);
```

The `main.ft` file:
```rs
use "utils.ft"
use Core.print

def recursive_count_main(i32 x):
    if x > 5:
        print("main end\n");
        return;
    print($"main:  {x}\n");
    recursive_count_utils(x + 1);

def main():
    recursive_count_main(0);
    print("\n");
    recursive_count_utils(0);
```

This program will print these lines to the console:

> ```
> main:  0
> utils: 1
> main:  2
> utils: 3
> main:  4
> utils: 5
> main end
>
> utils: 0
> main:  1
> utils: 2
> main:  3
> utils: 4
> main:  5
> utils end
> ```

As you can see, circular dependencies are absolutely no problem in Flint, and the only reason they are no problem is the dynamic exploratory nature of the compiler (you only specify one file and the compiler will find all included functions on its own) and the fact that the inclusion depth is only 1, so every use clausel is a shallow include.

## Side note

Because the files `main.ft` and `utils.ft` form a circle in the last example, you actually also could compile the program with the command `flintc -f utils.ft` and it would still work, as it would explore all files until it finds the main function. You can always think of file dependencies as a "tree". If, for example, file `main.ft` includes file `A`, which includes file `B` and you specify file `A` when compiling, you will get an error that no main function is defined, as the `main.ft` function was no longer part of the tree. If, however, file `A` or file `B` include `main.ft`, the compiler will be able to find the main file and main function again. Try it out and test a few file dependency trees and see for yourself how the compiler will react to it.
