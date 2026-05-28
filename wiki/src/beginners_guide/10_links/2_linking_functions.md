# Linking Functions

Lets continue with the example of the last chapter. We start by creating an entity which uses the `Func` interface:

```ft
use Core.print

func IMove:
	def move();

data DPosition:
	i32x2 pos;
	DPosition(pos);

entity Player:
	data: DPosition;
	func: IMove;
	Entity(Data);

def apply(mut IMove m):
	m.move();

def main():
	print("Hello, World!\n");
```

This program will result in this compile error:

> ```
> Parse Error at main.ft:10:1
> └──┬┤E0000│
> 10 │ entity Player:
> ┌──┴─┘
> └─ Virtual function 'IMove.move' not linked to concrete function
> ```

As you can see, we get a clear compile error telling us that the virtual function `IMove.move` was not linked to any concrete function when creating the entity type `Player`. In Flint *every virtual function of every func-module needs to be linked to a concrete function*, or otherwise the compiler won't compile the program.

## Func Implementation

Okay, lets say `IMove` is our general-purpose interface and we want to create a concrete implementation of the function from that interface (we added a second function, `print_pos`):

```ft
use Core.print

func IMove:
	def move();
	def print_pos();

data DPosition:
	i32x2 pos;
	DPosition(pos);

func FMovable requires(DPosition d):
	def move():
		d.pos += 10;

	def print_pos():
		print($"d.pos = {d.pos}\n");

entity Player:
	data: DPosition;
	func: IMove, FMovable;
	Player(DPosition);

def apply(mut IMove m):
	m.move();
	m.print_pos();

def main():
	p := Player(DPosition(i32x2(10, 20)));
	apply(p);
```

This program will result in this compile error:

> ```
> Parse Error at main.ft:18:1
> └──┬┤E0000│
> 18 │ entity Player:
> ┌──┴─┘
> └─ Virtual function 'IMove.print_pos' not linked to concrete function
> ```

Okay, now we have created a func module which contains the "implementations" of the `move` and `print_pos` functions defined in the `IMove` interface, but we still get the same compile error.

## Adding links to the mix

The missing piece is the `link`s in the entity definition. With the use of a `link`, we now can link the function `IMove.move` to `FMovable.move` and the function `IMove.print_pos` to `FMovable.print_pos`:

```ft
use Core.print

func IMove:
	def move();
	def print_pos();

data DPosition:
	i32x2 pos;
	DPosition(pos);

func FMovable requires(DPosition d):
	def move():
		d.pos += 10;

	def print_pos():
		print($"d.pos = {d.pos}\n");

entity Player:
	data: DPosition;
	func: IMove, FMovable;
	link:
		IMove::move -> FMovable::move,
		IMove::print_pos -> FMovable::print_pos;
	Player(DPosition);

def apply(mut IMove m):
	m.move();
	m.print_pos();

def main():
	p := Player(DPosition(i32x2(10, 20)));
	p.print_pos();
	apply(p);
```

This program will print these lines to the console:

> ```
> d.pos = (10, 20)
> d.pos = (20, 30)
> ```

The `link` syntax might look alien to you at first. This is because the `::` operator was not talked about yet in Flint. It's called the **function reference operator** and is used to create function references. This operator and its broader use-cases are a topic of a [later](wiki/src/intermediates_guide/4_callables/2_fn_type.md) chapter, it is not needed to understand the function reference operator to understand links for now.

So, the line

```ft
IMove::move -> FMovable::move,
```

means that we *link* the virtual function `IMove.move` to the concrete function `FMovable.move`. So, if we then do a `p.move()` later, not the `move` function of the `IMove` interface is called, but the `move` function of the `FMovable` func-module is called instead. When doing an instance-call on the known entity-type directly, like `p.xyz()` then a *direct* call is created. It is as if we would write `FMovable.move(p)` at that position.

## Entity Extension

When extending entities, as you know, all `data` and `func` modules are copied over from the base entity to the newly created entity. The same holds true for links as well. All links defined in the base entity are transferred over to the newly created entity as well. Try around a bit for yourself and see how Flint behaves to different links in different situations!

## Additional Info

When looking at the `mut IMove m` interface instance, the function call `m.move()` *also* results in `FMovable.move` being called. This happens because the `mut IMove m` instance variable is essentially a pointer to the entity (+ some metadata) under the hood. The exact runtime details would be too complex for this chapter here, but it works roughly like this:

Instead of calling `m.move()` we call a "dispatch" function and pass the **function ID** of the function we *would* call to it. This dispatch functions, which are created on a per-entity basis, then forward the call to the linked-to function, in our case `FMovable.move`.

You will learn the exact low level details of it all in a [later]() chapter, don't worry. For now, just remember that any `link`s when defining an entity also take effect when using the entity through an interface instance.
