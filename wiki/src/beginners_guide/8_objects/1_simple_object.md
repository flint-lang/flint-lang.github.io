# Simple Object

As said earlier we start by something which should look familiar, like a "regular old object" and more and more Flint features are introduced along the way. So, to start we will create the smallest possible object type:

```ft
use Core.print

data Transform:
	f32x2 pos;
	f32x2 dir;
	f32 speed;

object Player:
	data: Transform t;

	def move():
		t.pos += t.dir * t.speed;
	
	def print_position():
		print($"t.pos = {t.pos}\n");

def main():
	Player player = Player{Transform{(1.2, 3.4), (4.5, 6.7), 0.12}};
	player.print_position();

	for (_, _) in 0..5:
		player.move();
		player.print_position();
```

This program will print these lines to the console:

> ```
> t.pos = (1.2, 3.4)
> t.pos = (1.74, 4.204)
> t.pos = (2.28, 5.008)
> t.pos = (2.82, 5.812)
> t.pos = (3.36, 6.616)
> t.pos = (3.9, 7.42)
> ```

Okay, it's not necessarily the **smallest possible** object type, since we have two functions defined in it. But this is pretty much as minimal as it gets in Flint. As you can see, we create our object type by giving it a name and then describing which data components it contains:

```ft
object Player:
	data: Transform t;
```

In our case it only contains a single data component, `Transform`. This means that our object `Player` **has** a data component of type `Transform`. In of itself, this is nothing new or special yet. For example in languages like Java or C++ you would be able to define a few member variables and functions inside one class, so what's the difference?

In this very minimal and simple object, the only meaningful difference is that the `data` component is always stored sequentially in memory whereas in a class, the data is stored directly in the object instance itself.

Just like with `data`, we can choose to construct our object by either using *positional construction* or *named field construction*. As with data, we will use positional construction in all examples, but be aware that you very well can construct an object through naming its data accessors:

```ft
	Player player = Player{ .t = Transform{(1.2, 3.4), (4.5, 6.7), 0.12} };
```

Also, the same default-constructibility rules apply to objects as they do to data. In our simple example, all fields of the `Transform` data type are default-constructible which means that the `Transform` type itself is default-constructible. Since the object `Player` *only* contains the data `Transform` and nothing else, and that data is default-constructible, the `Player` itself *too* is default-constructible. This means that we also can construct a player using `Player{}` or `_`.

So far so good. The next thing defined in the object type definition are functions, `move` and `print_position`. These are called **methods** and are nothing special in the world of OOP. You will learn *exactly* how they work [soon](./4_signatures.md).
