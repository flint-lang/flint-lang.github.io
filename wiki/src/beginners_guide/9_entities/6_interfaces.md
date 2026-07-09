# Interfaces

What are interfaces? In OOP an interface is like a "contract" describing which methods a class has without describing _how_ these methods are implemented. In Flint, we have a concept similar to that and you already know it: `func` modules.

Func modules define functions which operate on a given set of data and whenever we add a func module to an entity we also must add it's required data to the entity for composition. So, entities are just a "collection of func modules with their associated data". As every `func` module always explicitely `requires` which data it will operate on and we _know_ that each entity which has a given `func` module always has it's associated data, we can essentially "store" an entity on a func-module typed variable, and this is our interface.

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

Every func-module instance is essentially a fat-pointer at runtime. It contains a pointer to the entity value it holds onto + some other needed runtime-information. Functions of different func-modules can be `link`ed and redirected (you will learn this in the next chapter) so the actual function being executed could differ. Note that func-modules used as interface objects do _not_ result in direct compile-time resolved calls, so doing `f.move(diff)` in our case does _not_ automatically mean that the `Func.move` function is being called, but more on that later.

## Lifetime

The lifetime of a func-module as interface is not bound by the lifetime of the entity from which the interface was created. Lets look at a small example to clarify that. All the other code is exactly the same as above, just the `main` function is different:

```ft
def main():
	e1 := Entity(Data(10, 20));
	Func f = e1;
	print($"f.(x, y) = ({f.get_x()}, {f.get_y()})\n");
	apply_move_operation(f, i32x2(5, 5));
	print($"f.(x, y) = ({f.get_x()}, {f.get_y()})\n");

	if true:
		e2 := Entity2(Data(30, 50), Data2(30, 3));
		f = e2;
	print($"f.(x, y) = ({f.get_x()}, {f.get_y()})\n");
	apply_move_operation(f, i32x2(5, 5));
	print($"f.(x, y) = ({f.get_x()}, {f.get_y()})\n");
```

This program will print these lines to the console:

> ```
> f.(x, y) = (10, 20)
> f.(x, y) = (15, 25)
> f.(x, y) = (30, 50)
> f.(x, y) = (35, 55)
> ```

As you can see, the interface `f` is _still_ valid after the `if true:` branch even though the variable `e1` went out of scope. This is because all entities in Flint are DIMA-managed, just like `data` is (DIMA will be explained [later](../../experts_guide/1_dima.md)). The entity `e2` went out of scope, but because `f` still holds onto it, the entity in `e2` it is not released yet.
