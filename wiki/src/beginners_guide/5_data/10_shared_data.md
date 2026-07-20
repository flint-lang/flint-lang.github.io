# Shared Data

We will talk more in-depth about `shared data` in a later chapter when talking about mutlithreading, as `shared data` is (will be) also auto-mutexed to be thread-safe (don't worry if you do not understand what this means, it will only become relevant way way later in the master expert guide). But for now we will just handle the simple case of shared data: using them as global variables:

```ft
use Core.print

def init() -> i32:
	print("init called\n");
	return 5;

def init2() -> i32:
	print("init2 called\n");
	return Globals.c * 2;

shared data Globals:
	i32 c = init();
	i32 c2 = init2();
	str s = "Hi, there";

def main():
	print($"Globals.c = {Globals.c}\n");
	print($"Globals.c2 = {Globals.c2}\n");
	for (i, _) in 0..10:
		Globals.c++;
	print($"Globals.c = {Globals.c}\n");
	print($"Globals.s = {Globals.s}\n");
	Globals.s = "Woof";
	print($"Globals.s = {Globals.s}\n");
```

This program will print these lines to the console:

> ```
> init called
> init2 called
> Globals.c = 5
> Globals.c2 = 10
> Globals.c = 15
> Globals.s = Hi, there
> Globals.s = Woof
> ```

We have some guarantees regarding `shared data` initialization: All "fields" of a single `shared data` are **guaranteed** to be evaluated in the order they are defined in. So, in our case `init` **always** runs before `init2` does. This means it is safe to access `Globals.c` inside the `init2` function. Within a single file, the order of initialization is also **guaranteed**, this means that earlier-defined `shared data` is initialized before later-defined ones. The order of definition directly correlates with the order of initialization. Across file-boundaries, the initialization order is **not guaranteed**. So if you have file `A` and file `B` you can **not** tell whether the `shared data` of file `A` or file `B` will be initialized first.

However, accessing `Globals.s` inside the `init2` function leads to accessing uninitialized memory and thus crashes. There is no safety mechanism in the compiler yet to detect this case. But because initialization order is guaranteed, it should be possible to build a "order graph" so that we can safely detect at compile-time whether global data is has been initialized by the time it is used. I will need to think more about this, but keep in mind that accessing global variables inside code which is called at initialization-time could lead to undefined behaviour (but since its all zero-initialized it will more likely result in crashes instead of UB).

You can use `shared data` whenever you want to have runtime global variables.
