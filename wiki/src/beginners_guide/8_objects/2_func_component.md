# Func Component

One of the most important types in Flint is the `func` component. It represents a reusable and composable collection of functionality which explicitely requires a set of `data` components to operate on. This means that a `func` component is self-contained and statically analyzable, but more on that later.

Here is a small example of a simple `func` component:

```ft
use Core.print

data Transform:
	f32x2 pos;
	f32x2 dir;
	f32 speed;
	Transform(pos, dir, speed);

func Movement requires(Transform t):
	def move():
		t.pos += t.dir * t.speed;
	
	def print_position():
		print($"t.pos = {t.pos}\n");

def main():
	t := Transform((1.2, 3.4), (4.5, 6.7), 0.12);
	Movement.print_position(t);
	Movement.move(t);
	Movement.print_position(t);
```

This program will print these lines to the console:

> ```
> t.pos = (1.2, 3.4)
> t.pos = (1.74, 4.204)
> ```

We define a new `func` component through the `func` keyword. After the name of the defined component, however, we need to write the `requires(...)` clausel. In this clausel we must put a list of `data` components and their accessor names respectively. All required data becomes available to be used inside the functions defined in the `func` component.

As you can see in the `main` function, we call functions inside the component using `Movement.move` for example. The `move` function does not have a single parameter defined, yet we still must pass the data component to it, why?

The func component definition essentially does nothing else than to re-write our functions from the above code to something more similar to:

```ft
def Movement.move(mut Transform t):
	t.pos += t.dir * t.speed;

def Movement.print_position(mut Transform t):
	print($"t.pos = {t.pos}\n");
```

at compile-time. But if this would be the only thing we need the func component for, it would be very boring indeed. But, as you can see clearly, the types defined in the `requires(..)` clausel become the first implicit N parameters of the functions within a `func` component.

## Requiring the same data twice

Func components can only require a particular data component once, so it is not allowed to write something like `requires(MyData d1, MyData d2)` for example:

```ft
use Core.print

data MyData:
	i32x2 pos;
	i32x2 size;
	MyData(pos, size);

func MyFunc requires(MyData d1, MyData d2):
	def move(i32 x, i32 y):
		d.pos = d.pos + (x, y);

	def print():
		print($"pos: {d.pos}, size: {d.size}\n");

def main():
	d := MyData(i32x2(100, 100), i32x2(100, 100));
	MyFunc.print(d);
	MyFunc.move(d, 10, 20);
	MyFunc.print(d);
```

This program will result in this compilation error:

> ```
> Parse Error at main.ft:8:33
> └─┬┤E0000│
> 8 │ func MyFunc requires(MyData d1, MyData d2):
> ┌─┴─────────────────────────────────┘
> ├─ Requiring the same type twice: MyData
> └─ Each required data type needs to be unique
> ```

## Requiring multiple data

Func components are not limited to require only one data component, you can require as many data components in a func component as you like to, given that all required data types are unique. It is *only* allowed to require `data` types, no other types are allowed to be required by `func` components, so you cannot write something like `requires(i32 x)` for example.

<div class="warning">

Feedback is welcome here

Regarding the `requires(i32 x)`, is there a use case where something like this would be useful, at all? I would love feedback on this design decision, as I am not able to see any practical benefit to it but my gut feeling tells me there *could* be something interesting hiding in plain sight here.

</div>

Here is a small example of using multiple different data types in the `requires` clausel of `func` components:

```ft
use Core.print

data MyData:
	i32x2 pos;
	i32x2 size;
	MyData(pos, size);

data Data2:
	f32x2 dir;
	Data2(dir);

func MyFunc requires(MyData d1, Data2 d2):
	def move(i32 x, i32 y):
		d1.pos = d1.pos + i32x2(f32(x) * d2.dir.x, f32(y) * d2.dir.y);

	def print():
		print($"pos: {d1.pos}, size: {d1.size}, dir: {d2.dir}\n");

def main():
	d1 := MyData(i32x2(100, 100), i32x2(100, 100));
	d2 := Data2(f32x2(3.3, 2.2));
	MyFunc.print(d1, d2);
	MyFunc.move(d1, d2, 10, 20);
	MyFunc.print(d1, d2);
```

This program will print these lines to the console:

> ```
> pos: (100, 100), size: (100, 100), dir: (3.3, 2.2)
> pos: (133, 144), size: (100, 100), dir: (3.3, 2.2)
> ```

As you can see, the signatures of the functions now became `MyFunc.move(mut MyData, mut Data2, i32, i32)` and `MyFunc.print(mut MyData, mut Data2)` respectively. The order of implicit parameters stays consistent from the `requires` clausel to the actual function signature.

This is as far as we can go with `func` components in isolation, without composing them within object definitions.

## Pure `func` component

<div class="warning">

This capability is subject to potential change

It is uncertain whether this ability, to create a `func` component which does not require any data components, will stay in Flint like this. I think it could be useful, but this part of `func` components is entirely open to be discussed further. If you think it is absolutely stupid, let me know!

</div>

It is possible to create a `func` component which does not require any data to operate on. Such components cannot be included in objects since they only directly depend on the input parameters of the functions and nothing else.

```ft
use Core.print

func Math:
	def add(i32 x, i32 y) -> i32:
		return x + y;

def main():
	i32 x = Math.add(10, 20);
	print($"x = {x}\n");
```

This program will print this line to the console:

> ```
> x = 30
> ```
