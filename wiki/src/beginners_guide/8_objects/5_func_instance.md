# Func Instance

It is possible to use `func` components as instances, just like we are able to use an `object` instance. This is not a hard-requirement of Flints composition-based design, it's just a nice-to-have feature instead, and it is pretty simple to explain. A `func` component instance is essentially nothing else than a tuple of pointers to its required data. I won't go fully in-depth into this here since that's something for the later chapters.

But lets talk a bit more about object instances first before we talk more about func instances. An `object` instance is nothing more than a tuple of pointers to its data at runtime. Because `data` components are memory-managed by [DIMA](../../experts_guide/1_dima.md), an object which requires 3 data components will just be a tuple of three pointers to its data at runtime, and nothing more. This is pretty important for this and for the next chapters which follow.

So, when we call a function coming from a `func` component on an object instance, for example `obj.somecall()` and that func component required 2 data components and our object contains three components, for example, then this call desugars to `FuncType.somecall(obj.$0, obj.$2)`. This means that, when calling functions from composed `func` components, we do nothing more than just pass the pointer to the data stored inside the object to the called function.

Okay, now that we have this out of the way we can look at an example for func instances:

```ft
use Core.print

data Data:
	i32 value;
	Data(value);

func Func requires(Data d):
	def inc(i32 x):
		d.value += x;

	const def print():
		print($"d.value = {d.value}\n");

object Object:
	data: Data d;
	func: Func;
	Object(d);

def main():
	o := Object(Data(10));
	o.inc(2);
	o.print();

	Func f = o;
	f.inc(3);

	o.print();
```

This program will print these lines to the console:

> ```
> d.value = 12
> d.value = 15
> ```

As you can see, we "stored" the object instance `o` on the func instance `f`, then called `f.inc(3)` and then we can see that it modified the data owned by the object itself by calling `o.print()` again.

The only way to create a `func` instance is by storing an `object` on it which contains said `func` component, there is no way to create func instance other than that.

<div class="warning">

Suggestions are welcome on this desgin

The ability to construct `func` instances without objects technically is possible syntactically. One could write something like `F f = (d1, d2, d3);` for example when `F` requires `D1`, `D2` and `D3` in this order. This does not work in the compiler at the moment, there is no codepath for it. I think it is better to keep func instance as purely object-instance "views", but suggestions are welcome.

</div>

I won't go into full details what exactly happens here, but we essentially just extract the pointers to the data from the object and store it in the func instance, which is **also** just a tuple of its required data pointers under the hood, and by that both the func instance and the object instance point to the same data when modifying it.

DIMA ensures that the pointers to the data remain valid, even if the object we created the "view" (the func instance) from goes out of scope. So, you can always assume that the data from any object or func instance is always valid.
