# Generic Types

You were already introduced to the concept of generic types in the CPL chapter, but that chapter only focused on the simplest case being generic `data` components. However, `data` is not the only type where a CPL can be added to it. Other types which can be generic include `variant`s, `object`s, `func` components and `interface`s. Since generic `data` components were already described in the CPL chapter, they are not further explained here.

## `variant`

<div class="warning">

The expressions like `Option[i32].Ok(100)` or `Option[i32].None` look quite verbose. Flint has no way of inferring the types yet. I want to change it in the future to support syntax more like this:

```ft
def main():
	Option[i32] maybe = .Ok(100);
	print($"maybe!(.Ok) = {maybe!(.Ok)}\n");

	maybe = .None;
	print($"maybe == .None = {maybe == .None}\n");
```

but this syntax is not implemented yet and does not work. It is planned that `.Tag` is allowed to be a valid expression, so that the actual type of the variant does not need to be written over and over again. I am pretty confident that this will be added in the future, even though I am not 100% sure yet on the exact syntax because of potential problems / overlaps in other unforeseen places.

</div>

One of the most simple example of generic variants is the `Option<T>` type which Rust relies heavily on. It is, however, impractical *for Flint* to define such a type as optionals are, as you know, built-in to the langauge using `T?`. Still, this type is very useful to showcase the CPL being applied on variants:

```ft
use Core.print

variant Option[type T]:
	Ok(T),
	None(void);

def main():
	Option[i32] maybe = Option[i32].Ok(100);
	print($"maybe!(Option[i32].Ok) = {maybe!(Option[i32].Ok)}\n");

	maybe = Option[i32].None;
	print($"maybe == Option[i32].None = {maybe == Option[i32].None}\n");
```

This program will print these lines to the console:

> ```
> maybe!(Option[i32].Ok) = 100
> maybe == Option[i32].None = true
> ```

Okay, so the definition looks exactly like a regular variant would look like, just with the added CPL, as described in the CPL chapter. You should be familiar with this by now. If the `Option` variant would not be generic, we would initialize and unwrap it using `Option.Ok(100)` and `maybe!(Option.Ok)` respectively. As you can see, the only thing different from "regular" syntax is that we need to apply a CVL to specialize the generic `Option` type, in our case `Option[i32]`. But other than that, it looks exactly like "regular" variants because post-specilization it **is** just a regular variant.

## `func`

A generic `func` component is rather interesting. Because it contains real, concrete functions, those functions it contains also are generic. The CPL of the func component is directly added to the CPL of the functions in its body. This means that a generic func component **only** contains generic functions.

```ft
use Core.print

data Vec2[type T]:
	T x;
	T y;

func Move[type T] requires(Vec2[T] pos):
	def by(Vec2[T] other):
		pos.(x, y) += other.(x, y);

	def to(Vec2[T] other):
		pos.(x, y) = other.(x, y);

def main():
	v2 := Vec2[i32]{ 10, 20 };
	diff := Vec2[i32]{ 5, 5 };
	print($"v2.(x, y) = {v2.(x, y)}\n");

	Move.by[i32](v2, diff);
	print($"v2.(x, y) = {v2.(x, y)}\n");

	Move.to[i32](v2, diff);
	print($"v2.(x, y) = {v2.(x, y)}\n");
```

This program will print these lines to the console

> ```
> v2.(x, y) = (10, 20)
> v2.(x, y) = (15, 25)
> v2.(x, y) = (5, 5)
> ```

As you can see, we did *not* specialize the func component type `Move` itself when calling a function (`Move[i32].by`) of it directly. Instead, we specialized the *function* through `Move.by[...]`. This is important, as **only** this second form is allowed when targetting the generic functions directly. When you define the `func` component as a runtime value, for example as a view into an object, you very well can, and need to, write `Move[i32] m = ...;`. We explicitely decided against allowing `Move[i32].by` as this would blur the line between the func component and its functions too much. When calling a function defined within a func component directly, you just do a regular call and nothing more, so specialization naturally happens at the function and not at the func component type.

## `object`

To showcase generic objects it will be best to show a generic list wrapper type, as you should be aware of linked lists by now this should feel familiar:

```ft
use Core.print

data DListNode[type T]:
	T value;
	DListNode[T]? next = none;

data DListHead[type T]:
	DListNode[T]? head;

object List[type T]:
	data: DListHead[T] list;

	def append(T value):
		if list.head == none:
			list.head = DListNode[T]{value};
			return;
		DListNode[T]? current = list.head;
		while current!.next != none:
			current = current!.next;
		current!.next = DListNode[T]{value};

	const def print():
		DListNode[T]? current = list.head;
		while current != none:
			print(str(current!.value));
			if current!.next != none:
				print(" -> ");
			current = current!.next;
		print("\n");

	const def size() -> u64:
		u64 size = 0;
		DListNode[T]? current = list.head;
		while current != none:
			size++;
			current = current!.next;
		return size;

def main():
	l1 := List[i32]{};
	l1.append(10);
	l1.append(20);
	l1.append(30);
	print($"l1.size() = {l1.size()}\n");
	l1.print();

	l2 := List[f32]{};
	l2.append(3.14);
	l2.append(6.9);
	l2.append(42.0);
	print($"l2.size() = {l2.size()}\n");
	l2.print();
```

This program will print these lines to the console:

> ```
> l1.size() = 3
> 10 -> 20 -> 30
> l2.size() = 3
> 3.14 -> 6.9 -> 42.0
> ```

The only thing which is "new" or special compared to other generic types here is the fact that you only needed to ever specialize the type of the list itself, all following member functions need no specializations, as `l1` and `l2` are already of a known specialized object type, meaning that there is no open CPL which awaits application for the functions like `.append()`, `.size()` or `.print()`.

## `interface`

The last example are generic interfaces. You should be rather familiar with generic definitions by now, so they should be rather simple to understand:

```ft
use Core.print

interface IComparable[type T]:
	def compare_with(T value) -> bool;

data Data[type T]:
	T x;

object Object[type T] implements(IComparable[T]):
	data: Data[T] d;

	def compare_with(T value) -> bool:
		return d.x == value;

def main():
	o := Object[i32]{Data[i32]{100}};
	print($"o.compare_with(10)  = {o.compare_with(10)}\n");
	print($"o.compare_with(100) = {o.compare_with(100)}\n");
```

This example will print these lines to the console:

> ```
> o.compare_with(10)  = false
> o.compare_with(100) = true
> ```
