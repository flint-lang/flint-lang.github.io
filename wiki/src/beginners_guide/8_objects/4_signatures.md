# Signatures

I briefly talked about **signatures** before but now is the time to talk about them in-depth as they will be needed in the next chapter. As you know, the explicitely required data components become the implicit first `N` parameters of every function defined inside a `func` component. You also have seen that a component like this:

```ft
func Movement requires(Transform t):
	def move():
		t.pos += t.dir * t.speed;
	
	def print_position():
		print($"t.pos = {t.pos}\n");
```

becomes something more like this during compilation:

```ft
def Movement.move(mut Transform t):
	t.pos += t.dir * t.speed;

def Movement.print_position(mut Transform t):
	print($"t.pos = {t.pos}\n");
```

The **signature** of the function is nothing else than the "desugared" form of that function. In case of `Movement.move` the signature of it is `mut Transform -> void` and the signature of `Movement.print_position` is the exact same. When we talk about signatures we mostly refer to the name of the function and the parameter + return types of the function.

As you can see, **all required data is mutable by default**. But what if we want to create a function inside a func component which does not modify its data? For example, all above functions are *not* callable when we have a constant object instance, so a call like `o.move()` would lead to a compile error:

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

object Object:
	data: Transform;
	func: Movement;
	Object(Transform);

def main():
	const Object o = Object(Transform((1.2, 3.4), (4.5, 6.7), 0.12));
	o.print_position();
	o.move();
	o.print_position();
```

This program will produce this compilation error:

> ```
> Parse Error at main.ft:23:5
> └──┬┤E0000│
> 21 │ def main():
> 23 │ »   o.print_position();
> ┌──┴─────┘
> └─ Calls which are not marked 'const' are not allowed on const instance 'o'
> ```

So, what does this "marked as `const`" mean?

## `const` functions

We are able to put the `const` keyword in front of the `def` keyword in Flint. When we take the above example we can just add the `const` keyword in front of the `print_position` definition:

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

object Object:
	data: Transform;
	func: Movement;
	Object(Transform);

def main():
	const Object o = Object(Transform((1.2, 3.4), (4.5, 6.7), 0.12));
	o.print_position();
	// o.move();
	// o.print_position();
```

This program will print this line to the console:

> ```
> t.pos = (1.2, 3.4)
> ```

This now works because by adding the `const` keyword we changed the **signature** of the function. Now the desugared functions look like this:

```ft
def Movement.move(mut Transform t):
	t.pos += t.dir * t.speed;

def Movement.print_position(const Transform t):
	print($"t.pos = {t.pos}\n");
```

And now we can no longer change the required data from within that function, so this means we **guarantee** that no internal data will be modified by const functions. This is true for both functions defined in `func` components and for functions defined in an `object`. See what happens when you add `const` in front of the `move` function for yourself!

As a general rule of thumb: If you do not modify any required (`func`) or internal (`object`) data, always mark the function as `const`.

## Implicit `self` parameter in object functions

Now you know the signatures of `func` components, but what about functions defined in objects? They always have one implicit first parameter, the object itself. Just like `func` components have their `required` data values as parameters, objects have an implicit `self` parameter. So lets look at this very simple example:

```ft
use Core.print

data DCounter:
	i32 value;
	DCounter(value);

object Counter:
	data: DCounter c;
	Counter(c);
	
	def inc(i32 n):
		c.value += n;
	
	const def get() -> i32:
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

When we look at the functions from the above example, they would look like this:

```ft
def Counter.inc(mut Counter self, n):
	self.c.value += n;

def Counter.get(const Counter self):
	return self.c.value;
```

This implicit `self` parameter, as can be seen shortly, is accessible in the function body, it will become very important in later chapters too. Try it out for yourself. Add the line `self.inc(10);` before the `return c.value;` line inside the `Counter.get` function and see which error you will get!

You always need to remember that the first implicit parameter of any function defined within an object is the `self` parameter, because for direct object-function calls like `Counter.inc(c, 10)` you need to pass in an object instance as the first argument. This `self` argument can be pretty useful in function delegation:

```ft
use Core.print

data Data:
	i32 value;
	Data(value);

func Func1 requires(Data d):
	const def fn1():
		print($"fn1: {d.value}\n");

func Func2 requires(Data d):
	const def fn2():
		print($"fn2: {d.value}\n");

object Object:
	data:
		Data d;
	func:
		Func1, Func2;
	Object(d);
	
	def do_stuff():
		self.fn1();
		d.value += 5;
		self.fn2();

def main():
	o := Object(Data(10));
	o.do_stuff();
```

This program will print these lines to the console:

> ```
> fn1: 10
> fn2: 15
> ```

As you can see, we composed two different func components inside one new object type and then we created a "wrapper" function `do_stuff` which first calls a function of the first func component `Func1`, then increments the value and then calls the function of the second func component `Func2`. For this very reason, the `self` parameter is needed. We need it to delegate further calls on the object itself. In this particular case we also could have written `Func1.fn1(d);` instead of `self.fn1();`, but what happens when you want to call a function defined within the object from a different function defined inside the same object? We need some way to pass the object instance to the function.

There is nothing magical about functions defined in objects, just like there is nothing magical about func components.

## Implicit vs explicit signatures

The difference between **explicit** and **implicit** signatures is pretty simple to explain. The **explicit** signature is **always** the signature we explicitely write. For example in a func component which requires some data, we might write `def print():` meaning that the **explicit** signature will be `() -> void`, no args, no return value. But the **implicit** signature is the "desugared" signature, so maybe `mut Data1, mut Data2 -> void` in the case of `print`, depending on which data the func component requires.

This is also the exact same for objects. The explicit signature is the one we write down while the implicit signature is the resolved signature.
