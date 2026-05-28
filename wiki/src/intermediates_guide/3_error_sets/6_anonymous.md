# Throwing Anonymous Errors

Having to define an error set first and then choose when throwing an error which value from the error set to throw is tedious and quite a lot of work when just prototyping stuff, or when throwing special-case errors which are not really part of a broader error set at all for example. This happens quite often, so for this very reason Flint supports anonymous errors. But what even *are* anonymous errors?

Lets look at an actual example first before continuing with the theory:

```ft
use Core.print

def crash():
	throw error.Crash("Custom Message");

def main():
	crash() catch err:
		print($"{err}: \"{err.message}\"\n");
```

This program will print these lines to the console:

> ```
> error.17591431759785607604.Crash: "Custom Message"
> ```

But how do anonymous errors even work? Well, firstly anonymous errors have no underlying error set type visible to the programmer, like when defining your own error set types. This means that it is not possible to tell which error was thrown when throwing anonymous errors, only **that** an error has happened. Also note that we can still access the fields `type_id`, `value_id` and `message` on an error of type `anyerror`. The error structure did not change at all, as you know already. When using anonymous errors, the compiler will just "make up" a name for an error set on a per-function basis (using the function ID). This means that, if you would throw a few anonymous errors within the same function, all those anonymous errors would actually end up in the same internal error set type:

```ft
use Core.print

def crash(i32 v):
	switch v:
		0: throw error.Crash("Custom Message");
		1: throw error.CrashOther;
		else: throw error.CrashLast("LAST");

def print_crash(i32 v):
	crash(v) catch err:
		print($"{err}: \"{err.message}\"\n");

def main():
	print_crash(0);
	print_crash(1);
	print_crash(2);
```

This program will print these lines to the console:

> ```
> error.18152922749114152985.Crash: "Custom Message"
> error.18152922749114152985.CrashOther: ""
> error.18152922749114152985.CrashLast: "LAST"
> ```

As you can clearly see in the output of this example, the error type, `error.18152922749114152985`, is identical, but the value (`Crash`, `CrashOther`, `CrashLast`) differs. The name of the newly created error type is just `error.<fn_id>`, so if you change the signature or the body of a function, then it's function ID will change. So, under the hood the error set

```ft
error "error.18152922749114152985":
	Crash, CrashOther, CrashLast;
```

is created. The `"` are just used to describe that that's the *name* of the error set. It is not possible for users to create such a named error set. There is nothing "magical" about anonymous errors whatsoever.
