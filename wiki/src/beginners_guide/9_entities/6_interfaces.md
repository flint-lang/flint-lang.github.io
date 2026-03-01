# Interfaces

What are interfaces? In OOP an interface is like a "contract" describing which methods a class has without describing *how* these methods are implemented. In Flint, we have a concept similar to that and you already know it: `func` modules.

Func modules define functions which operate on a given set of data and whenever we add a func module to an entity we also must add it's required data to the entity for composition. So, entities are just a "collection of func modules with their associated data". As every `func` module always explicitely `requires` which data it will operate on and we *know* that each entity which has a given `func` module always has it's associated data, we can essentially "store" an entity on a func-module typed variable, and this is our interface.

Here a small example:

```ft
use Core.print

data Data:
	i32 x;
	i32 y;
	Data(x, y);

func Func requires(Data d):
	def move(i32x2 diff):
		d.(x, y) += diff.(x, y);

	def get_x() -> i32:
		return d.x;

	def get_y() -> i32:
		return d.y;

entity Entity:
	data: Data;
	func: Func;
	Entity(Data);

data Data2:
	i32 z;
	i32 speed;
	Data2(z, speed);

func Func2 requires(Data d, Data2 d2):
	def move2(f32x3 direction):
		f32x3 diff = direction * f32(d2.speed);
		d.(x, y) += i32x2(diff.x, diff.y);
		d2.z += i32(diff.z);

	def get_z() -> i32:
		return d2.z;

entity Entity2 extends(Entity e):
	data: Data2;
	func: Func2;
	Entity2(e, Data2);

def apply_move_operation(mut Func f, i32x2 diff):
	f.move(diff);

def main():
	e1 := Entity(Data(10, 20));
	print($"e1.(x, y) = ({e1.get_x()}, {e1.get_y()})\n");
	apply_move_operation(e1, i32x2(5, 5));
	print($"e1.(x, y) = ({e1.get_x()}, {e1.get_y()})\n");

	e2 := Entity2(Data(10, 20), Data2(30, 3));
	print($"e2.(x, y, z) = ({e2.get_x()}, {e2.get_y()}, {e2.get_z()})\n");
	apply_move_operation(e2, i32x2(5, 5));
	print($"e2.(x, y, z) = ({e2.get_x()}, {e2.get_y()}, {e2.get_z()})\n");
```

This program will print these lines to the console:

> ```
> e1.(x, y) = (10, 20)
> e1.(x, y) = (15, 25)
> e2.(x, y, z) = (10, 20, 30)
> e2.(x, y, z) = (15, 25, 30)
> ```

There are a few things we need to go through first. You can see that `Entity2` extends `Entity` which means that `Entity2` also has the `Data` and `Func` modules, just like `Entity`. Because of that we can "cast" each entity type to their respective `func` types. So, both `Entity` and `Entity2` are "castable" to `Func` but only `Entity2` can be "cast" to `Func2`, since `Entity` does not contain the func module `Func2`.

"Casting" here is not quite correct. Each `func` module, when used as a variable type, is just a "slice" of it's required data. So in our case `Func` is a simple struct: `data<Data>`, which means when we call `f.move(...)` in the `apply_operation` function the "method call" resolves to `Func.move(f.$0, diff)` just like it would with a "real" entity.

As every data in Flint is just a pointer to the actually allocated data we can modify the data even when passing func modules around as interfaces. But you will learn about these internals of Flint later, they are not that important for now.

## Lifetime

The lifetime of a func-module as interface is not bound by the lifetime of the entity from which the interface was created. Let'ss look at a small example to clarify that. All the other code is exactly the same as above, just the `main` function is different:

```ft
def main():
	Func f;
	if true:
		e1 := Entity(Data(10, 20));
		f = e1;
	print($"f.(x, y) = ({f.get_x()}, {f.get_y()})\n");
	apply_move_operation(f, i32x2(5, 5));
	print($"f.(x, y) = ({f.get_x()}, {f.get_y()})\n");

	e2 := Entity2(Data(10, 20), Data2(30, 3));
	print($"e2.(x, y, z) = ({e2.get_x()}, {e2.get_y()}, {e2.get_z()})\n");
	apply_move_operation(e2, i32x2(5, 5));
	print($"e2.(x, y, z) = ({e2.get_x()}, {e2.get_y()}, {e2.get_z()})\n");
```

This program will print these lines to the console:

> ```
> f.(x, y) = (10, 20)
> f.(x, y) = (15, 25)
> e2.(x, y, z) = (10, 20, 30)
> e2.(x, y, z) = (15, 25, 30)
> ```

As you can see, the interface `f` is *still* valid after the `if true:` branch even though the variable `e1` went out of scope. This is because all data in Flint is DIMA-managed (more on that later). The entity `e1` went out of scope, but because `f` still holds onto `Data` of `e1` it is not released yet. If we were do the same for `e2` then `Data2` *would* be released after the branch, but `Data` would not.
