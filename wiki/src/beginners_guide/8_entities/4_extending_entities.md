# Extending Entities

You already know that entities can contain multiple different `data` and `func` modules composed together to be able to model a specific type. But if you would need to write out *every* single `data` and `func` module an entity **contains** over and over again it would be very tedious and it also would become very messy fast. You simply would not be able to tell which data or func modules it really contains because it would drown in the sea of data and func modules.

For this very reason exists the `extends` clausel. It's not like the `extends` keyword in Java, for example. In OOP the `extends` keyword describes a direct indentity-relationship. In Flint it is a bit different. Since every entity is simply a **collection** of different `data` and `func` modules, the `extends` clausel simply takes all the `data` and `func` modules of the "extended" entity and places them in our new entity. Here is an example:

```ft
use Core.print

data Data1:
	u32 value;
	Data1(value);

data Data2:
	f32 value;
	Data2(value);

data Data3:
	i32 value;
	Data3(value);

func Func1 requires(Data1 d1):
	def f1():
		print($"f1: {d1.value}\n");

func Func2 requires(Data2 d2):
	def f2():
		print($"f2: {d2.value}\n");

func Func3 requires(Data3 d3):
	def f3():
		print($"f3: {d3.value}\n");

entity Entity1:
	data: Data1;
	func: Func1;
	Entity1(Data1);

entity Entity2 extends(Entity1 e1):
	data: Data2;
	func: Func2;
	Entity2(e1, Data2);

entity Entity3 extends(Entity2 e2):
	data: Data3;
	func: Func3;
	Entity3(e2, Data3);

def main():
	e1 := Entity1(Data1(100));
	e1.f1();
	print("\n");

	e2 := Entity2(Data1(80), Data2(3.4));
	e2.f1();
	e2.f2();
	print("\n");

	e3 := Entity3(Data1(8), Data2(3.14), Data3(-30));
	e3.f1();
	e3.f2();
	e3.f3();
```

This program will print these lines to the console:

> ```
> f1: 100
>
> f1: 80
> f2: 3.4
>
> f1: 8
> f2: 3.14
> f3: -30
> ```

Okay now let's go throug this example slowly. With the `extends` keywords we describe that `Entitiy2` *has* all the capabilities of `Entity1` but it *has* more. This is pretty similar to how you would think in OOP, but with one major difference: All `data` and `func` modules of extended entities *flatten out*. You see, every `func` module and every `data` module of every `entity` is essentially like a small "set" of modules. So the `Entity1` type has a data set of `{ Data1 }`, the `Entity2` type has a data set of `{ Data1, Data2 }`. This is because the `extends` clausel is essentially like a union operator. The new set of the new entity type is a union of all the data modules defined in it's body and all data modules from all extended entity types.

So, Flint will simply ignore all duplicates which come from any parent entities, however, if a data or func module is already defined in one of the parent entities, then Flint will shout out an error to you. If we change the definition of `Entity3` from the example above to something like this:

```ft
entity Entity3 extends(Entity2 e2):
	data: Data2, Data3;
	func: Func3;
	Entity3(e2, Data3);
```

then we will get this compiler error telling us that we have defined a data module twice while defining it *manually* inside an entity:

> ```
> Parse Error at main.ft:38:11
> └──┬┤E0000│
> 37 │ entity Entity3 extends(Entity2 e2):
> 38 │ »   data: Data2, Data3;
> ┌──┴───────────┘
> └─ Entity type defines data module 'Data2' twice
> ```

As you can see, if you had defined a data or func type before and then added it to an entity the other entity extends, the compiler will tell you that you need to fix the entity that extends it, since it then would have been a double-inclusion, which is a good thing in my view, as it means that entity definitions will stay as minimal as possible ever over a long time period and potential changes to their "parent" entities.

Just like with the `requires` clausel you are *only* allowed to put values of type `entity` in the extends clausel, and just like the `requires` clausel you can extend as many other entities as you want. There do not exist any relationships between entities at runtime, they are all different types. This also means that you are *NOT* able to "cast" any entity type to any other entity type either.
