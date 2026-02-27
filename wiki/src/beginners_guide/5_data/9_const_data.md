# Const Data

Const data in Flint are compile-time constant global data. This means that they are data which has no runtime footprint, cannot be initialized and does not exist after compilation. This is especially useful for configuration files or global variables.

In Flint, global variables work different than they do in other languages, because Flint does not have any global variables in the traditional sense (it does have runtime-mutable globals but you only will learn about them in a way [later]() chapter). Constant data has emerged from the fact how default-values of data fields work under the hood, but let's look at a simple example first:

```ft
use Core.print

const data Globals:
	i32 x = 10;

def main():
	print($"x = {Globals.x}\n");
```

This program will print this line to the console:

> ```
> x = 10
> ```

As you can see, the `const data Globals` does not contain an initializer for it's "fields", that's because it is not usable as a runtime-type like all data is which we have looked at up until now. We can access the global constant variables defined in `Globals` by writing `Globals.x`.

## Expression Substitution

This is a very complex name for something very simple: When we write the expression `Globals.x` the compiler will *not* insert the value it computed for this expression, like `10` in our example. Instead something way more simple happens: The compiler will literally just copy and paste the expression after the `=` in the const data definition for `x`. So, in this case it will insert the expression `10` where `Globals.x` stands now. So, the program will resolve more to something like this:

```ft
use Core.print

def main():
	print($"x = {10}\n");
```

before being compiled. But: The fact that the compiler literally just copies the expression means that we are *not* just limited to literals, like `10` but we can write *any* expression as the right side of a global value:

```ft
use Core.print

data MyData:
	i32 x = 4;
	f32 y = 3.14;
	str s = "Hi there!";
	MyData(x, y, s);

const data Globals:
	i32 x = 10;
	MyData md = MyData(10, 38.2, "Hello 2");

def main():
	print($"x = {Globals.x}\n");
	md := Globals.md;
	print($"md.(x, y, s) = ({md.x}, {md.y}, \"{md.s}\")\n");
```

This program will print these lines to the console:

> ```
> x = 10
> md.(x, y, s) = (10, 38.200001, "Hello 2")
> ```

But what exactly happened here? Well because the expression `Globals.md` got **replaced** with `MyData(10, 38.2, "Hello 2")` what we actually wrote was this code right here:

```ft
use Core.print

data MyData:
	i32 x = 4;
	f32 y = 3.14;
	str s = "Hi there!";
	MyData(x, y, s);

def main():
	print($"x = {10}\n");
	md := MyData(10, 38.2, "Hello 2");
	print($"md.(x, y, s) = ({md.x}, {md.y}, \"{md.s}\")\n");
```

This also means that *any function call* within the `const data` will *not* happen at compile-time but at runtime since we literally just copy and paste the expression into the correct place:

```ft
use Core.print

def print_addition(i32 x, i32 y) -> i32:
	print($"{x} + {y} = {x + y}\n");
	return x + y;

const data Globals:
	i32 x = print_addition(10, 20);

def main():
	print($"x = {Globals.x}\n");
```

This program will print these lines to the console:

> ```
> 10 + 20 = 30
> x = 30
> ```

As you can see, `const data` is essentially a lightweight-macro system akin to C's `#define` macros, but const data is way not as powerful as C macros are, it's just a simple expression-substitution rule, nothing more and nothing less.
