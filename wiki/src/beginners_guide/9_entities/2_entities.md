# Entities

An `entity` is essentially a collection of data and functionality, similar to an `Object` or `Class` in OOP. DOCP is based on the concept of **composition** instead of **inheritance**, but more on that [later](./3_composition.md). You simply need to know that any entity is composed of `data` and `func` modules. Here is a small example of the most simple entity:

```ft
use Core.print

data DTransform:
	i32x2 pos;
	i32x2 size;
	DTransform(pos, size);

func FMove requires(DTransform trans):
	def print():
		print($"pos: {trans.pos}, size: {trans.size}\n");

entity Entity:
	data: DTransform;
	func: FMove;
	Entity(DTransform);

def main():
	e := Entity(DTransform(i32x2(100, 120), i32x2(200, 220)));
	e.print();
```

This program will print this line to the console:

> ```
> pos: (100, 120), size: (200, 220)
> ```

There is **a lot** to talk about here. First of all, the syntax to define an entity is *weird* you might say. When defining an entity you *describe* which `data` and `func` module the entity consists of, and then you write a **Constructor** similar to how you do it for any `data` type, and in the constructor you define the order in which data needs to be passed to the entity when constructing it. In our case the entity only contains the `DTransform` data so there is no order to set.

As you can see, we can call the `print` function on the variable `e` of type `Entity` without passing in any data. On the call-side the function looks exactly like defined in the `FMove` func module, with no parameters. We can call the `print` function of the `FMove` func module because the entity `Entity` explicitely contains that func module's functions (via the `func: <Type>;` line).

Like you saw above, you do not need to pass any data to functions. This has one very simple explaination: An entity is simply a tuple of it's data. So, the `Entity` type at runtime is just `data<DTransform>` in our case. This means that the call `e.print()` from the above example actually resolves to code like `FMove.print(e.$0)`. This is how entities work under the hood, but entities have another important rule / concept: encapsulation.

## Encapsulation

The data of an entity can **never** be accessed from the outside world. This means that you cannot just write `e.$0` for example, since an entity is not a tuple on the surface. **Entity data can only be modified from within functions defined in func modules**. This means that whenever you want to modify any entity data you need to modify it through a call on the entity variable instance itself. An entity **owns** it's data, which means that you cannot get a reference to it's data by any means.

So, when you would want to get the position of the above entity then you would need to write something like this:

```ft
use Core.print

data DTransform:
	i32x2 pos;
	i32x2 size;
	DTransform(pos, size);

func FMove requires(DTransform trans):
	def print():
		print($"pos: {trans.pos}, size: {trans.size}\n");

	def get_pos() -> i32x2:
		return trans.pos;

entity Entity:
	data: DTransform;
	func: FMove;
	Entity(DTransform);

def main():
	e := Entity(DTransform(i32x2(100, 120), i32x2(200, 220)));
	e.print();
	print($"e.pos = {e.get_pos()}\n");
```

This program prints these lines to the console:

> ```
> pos: (100, 120), size: (200, 220)
> e.pos = (100, 120)
> ```

This *may* seem inefficient or boiler-platy, but this design has big impications regarding multi-threading safety and general code safety, but this is a topic of a waaaay later chapter in the Expert to Master book.

## Missing data

There are only a few reasons to why we `require` any data in `func` modules at all. The first reason is that whenever we call a function like `print` on the entity `e` we *know* that this function *only* ever touches the `DTransform` data of the entity, but not any other data it may contain. This is crucial for parallelism. The other reason, which is more important now, is that the required data forms a *contract* to the entity. If the entity does not provide the data the func module requires then we get a compile error. Here is an example of just that:

```ft
use Core.print

data DTransform:
	i32x2 pos;
	i32x2 size;
	DTransform(pos, size);

data DScale:
	f32x2 scale;
	DScale(scale);

func FMove requires(DTransform trans, DScale scale):
	def print():
		print($"pos: {trans.pos}, size: {trans.size}, scale: {scale.scale}\n");

	def get_pos() -> i32x2:
		return trans.pos;

entity Entity:
	data: DTransform;
	func: FMove;
	Entity(DTransform);

def main():
	e := Entity(DTransform(i32x2(100, 120), i32x2(200, 220)));
	e.print();
	print($"e.pos = {e.get_pos()}\n");
```

This program prints this compile error:

> ```
> Parse Error at main.ft:19:1
> └──┬┤E0000│
> 19 │ entity Entity:
> ┌──┴─┘
> └─ Entity type is missing data 'DScale' required by func module 'FMove'
> ```

In this example we added the `DScale` data requirement to the `FMove` func module and the entity which uses it now needs to be updated to contain the new data that func module requires. To fix this problem we need to add the data type to the entity definition and to it's constructor:

```ft
use Core.print

data DTransform:
	i32x2 pos;
	i32x2 size;
	DTransform(pos, size);

data DScale:
	f32x2 scale;
	DScale(scale);

func FMove requires(DTransform trans, DScale scale):
	def print():
		print($"pos: {trans.pos}, size: {trans.size}, scale: {scale.scale}\n");

	def get_pos() -> i32x2:
		return trans.pos;

entity Entity:
	data: DTransform, DScale;
	func: FMove;
	Entity(DTransform, DScale);

def main():
	e := Entity(DTransform(i32x2(100, 120), i32x2(200, 220)), DScale(f32x2(3.3, 4.4)));
	e.print();
	print($"e.pos = {e.get_pos()}\n");
```

And now this program prints this code to the console:

> ```
> pos: (100, 120), size: (200, 220), scale: (3.3, 4.4)
> e.pos = (100, 120)
> ```

As you can see, the explicit requirements of func modules are our friend here.
