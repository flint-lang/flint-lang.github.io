# Entity Functions

Flint supports defining functions directly inside an entity as so-called free-floating functions or entity-functions. While Flint is based on the DCMP and the idea that entities are just a collection of data and functionality composed together, the fact that some functions need access to *all* data and functionality of an entity still cannot be left out of sight.

Many different data and func modules, for example, provide quite a lot of functionality but one still sometimes needs an "wrapper function", a function which delegates all those composed pieces. Entity-functions exist for this exact use-case. Let's start with the simplest form of an entity using entity-functions:

```ft
use Core.print

data DCounter:
	i32 value;
	DCounter(value);

entity Counter:
	data: DCounter c;
	Counter(c);
	
	def inc(i32 n):
		c.value += n;
	
	def get() -> i32:
		return c.value;

def main():
	c := Counter(DCounter(0));
	c.inc(10);
	Counter.inc(c, 5);
	print($"c.get() = {c.get()}\n");
```

This program will print this line to the console:

> ```
> c.get() = 15
> ```

Entity-defined functions *must* be placed *after* the constructor of an entity. So, the structure of an entity is:

1. Data Modules
2. Func Modules
3. Links (will be introduced in later chapters)
4. Hooks (will be introduced in later chapters)
5. Constructor
6. Functions

This is the most simple form of entity-defined functions, no func-modules, just data + entity. It's the closest to an object in OOP too, but this above case should *not* be used too often. Flint discourages it through a few designs, lets go through those designs and rules.

## Implicit Entity Parameter

Entity-defined functions always have one implicit first parameter, the entity itself. Just like `func`-modules have their `required` data values as parameters, entities have them`self` as an implicit parameter. So, the `inc` function from the above example would actually look something like

```ft
def Counter.inc(mut Counter self, n):
    self.c.value += n;
```

This implicit `self` parameter, as can be seen later, is actually accessible in the function body, it will become very important in later chapters too.

You need to remember that the first implicit parameter of any function defined within an entity is the self parameter, because for direct entity-function calls like `Counter.inc(c, 10)` you need to pass in an entity instance as the first argument. This `self` argument can be pretty useful in function delegation (using entity-functions "correctly"):

```ft
use Core.print

data Data:
	i32 value;
	Data(value);

func Func1 requires(Data d):
	def fn1():
		print($"fn1: {d.value}\n");

func Func2 requires(Data d):
	def fn2():
		print($"fn2: {d.value}\n");

entity Entity:
	data:
		Data d;
	func:
		Func1, Func2;
	Entity(d);
	
	def do_stuff():
		self.fn1();
		d.value += 5;
		self.fn2();

def main():
	e := Entity(Data(10));
	e.do_stuff();
```

This program will print these lines to the console:

> ```
> fn1: 10
> fn2: 15
> ```

As you can see, we composed two different func modules inside one new entity type and then we created a "wrapper" function `do_stuff` which first calls a function of the first func-module, then increments the value and then calls the function of the second func-module. For this very reason, the `self` parameter is needed. We need it to delegate further calls on the entity it`self`.

There is nothing magical about entity-defined functions, just like there is nothing magical about func-module functions.

## Accessing Parent Data

It is possible to access the data of parent entities inside entity functions. For parent data to be accessible, that parent data needs to be named:

```ft
use Core.print

data Data1:
	i32 x;
	i32 y;
	Data1(x, y);

data Data2:
	i32 z;
	i32 w;
	Data2(z, w);

func Func requires(Data1 d):
	def fun():
		print("fun\n");

entity E:
	data: Data1 d1;
	func: Func;
	E(d1)

entity Entity extends(E e1):
	data: Data2 d2;
	Entity(e1, d2);

	def print():
		print($"d1.(x, y) = {e1.d1.(x, y)}, d2.(z, w) = {d2.(z, w)}\n");

def main():
	e := Entity(Data1(10, 20), Data2(30, 40));
	e.print();
```

This program will print this line to the console:

> ```
> d1.(x, y) = (10, 20), d2.(z, w) = (30, 40)
> ```

For example we can only access the parent entity data `e1.d1` because we gave it a name, `d1`. If we would not have given the parent entity data a name then we would not be able to access it in entity functions of extended entities.

## Entity Extension

When extending entities, the newly created entity includes all its parents `data` modules and `func` modules, which means that any function of their parents can be called in that newly created entity. Entity-functions, however, are on a strict per-type basis. So, if you define an entity-function in entity type `A` and extend it in type `B` through `entity B extends(A a):` then the entity-functions of `A` will **not** be present in type `B`. Their signatures simply do not match, and if `B` would get `A`s functions then it would start to look and feel like OOP, which DCMP isn't.
