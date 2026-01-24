# Func Modules

The basics of DOCP are `func` modules. A `func` module is a collection of functions which operate on the same data. The simplest example is one where we define a func module which does not require any data to operate:

```ft
use Core.print

func MyFunc:
    def add(i32 x, i32 y) -> i32:
        return x + y;

    def print(i32 x):
        print($"x: {x}\n");

def main():
    i32 thirty = MyFunc.add(10, 20);
    MyFunc.print(thirty);
```

This program will print this line to the console:

> ```
> x: 30
> ```

First of all, as you can see a func module which does not require any data essentially becomes a namespace for functions. A `func` module does **not** have a runtime-footprint, the functions inside it, like `add` resolve to a function like `MyFunc.add`, that's it. The name of the function is changed at compile-time from `add` inside of `MyFunc` to `MyFunc.add`. There are still only two functions defined, just as if we would have written the functions directly, but with one major difference: There now are no collisions between the `MyFunc.print(i32)` and the `print(i32)` function of the `Core.print` module.

## Function Collision

These functions would have collided if we would not have defined them inside the `MyFunc` func module:

```ft
use Core.print

def add(i32 x, i32 y) -> i32:
    return x + y;

def print(i32 x):
    print($"x: {x}\n");

def main():
    i32 thirty = add(10, 20);
    print(thirty);
```

This program shows this compiler error:

> ```
> Parse Error at main.ft:6:1
> └─┬┤E0000│
> 6 │ def print(i32 x):
> ┌─┴─┘
> ├─ Redefinition of function: print(i32)
> └─ First defined at: Bmm6x3ZN:0:0
> ```

The `First defined at: ...` error line here simply means that the function was first defined in the core module, namely `Core.print`. This error message will change in the future, but it is good enough for now. But as you can see, the `print(i32)` function already exists, which means we cannot define this function when the `print` function already exists from the `print` Core module. But, as shown above, we can define the functions inside a `func` module and by doing so the functions do no longer collide with the builtin print functions.

## Requiring Data

But if this would have been the only purpose of `func` modules they would not be that interesting. The thing which makes func modules interesting is that you can explicitely require data in them. Here a small example:

```ft
use Core.print

data MyData:
	i32x2 pos;
	i32x2 size;
	MyData(pos, size);

func MyFunc requires(MyData d):
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

This program will print these lines to the console:

> ```
> pos: (100, 100), size: (100, 100)
> pos: (110, 120), size: (100, 100)
> ```

We have quite a lot to talk about here. First of all, note the new `requires(...)` clausel after the `func` module definition. It means that this func module, `MyFunc`, now operates on the data `MyData`. This becomes more important when we come to entities in the next chapter.

As told earlier, `func` modules disappear at compile-time in the form of new functions, the `move` function becomes `MyFunc.move` as said earlier. The `requires` clausel is just one more rule to that, and it's very simple. The data required by the clausel becomes the **implicit first parameter of every function in that `func` module**. All required data is *always* a mutable parameter of *every* function in that `func` module's body.

This means that the `move` function will have the signature `MyFunc.move(mut MyData, i32, i32)` after compilation and that the `print` function will have the signature `MyFunc.print(mut MyData)`. This key property of func modules is very important to understand in order to be able to understand `func` modules as a whole.

As you can see, we now are able to call the `print` and `move` functions manually but now we need to pass in the first parameter of type `MyData` to them.

## Requiring the same data twice

Func modules can only require a particular data type once, so it is not allowed to write something like `requires(MyData d1, MyData d2)` for example:

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

Func modules are not limited at only one data type they can require, you can require as many data types in a func module as you would like to, given that all required data types are unique amongst them. It is *only* allowed to require `data` types, no other types are allowed to be required by `func` modules.

Here is a small example of using multiple different data types in the `requires` clausel of `func` modules:

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

This is as far as we can go with `func` modules without talking about `entities`, and only with them `func` modules will *actually* become useful. So, let's on to them, shall we?
