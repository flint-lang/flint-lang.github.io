# Throwing Anonymous Errors

<div class="warning">

Anonymous errors do not work yet

While the design around anonymous errors is finished for the compiler already, they have not been implemented yet. So, this section will become important eventually, but not yet.

</div>

Having to define an error set first and then choose when throwing an error which value from the error set to throw is tedious and quite a lot of work when just prototyping stuff, or when throwing special-case errors which are not really part of a broader error set at all for example. This happens quite often, actually, so for this very own reason Flint supports anonymous errors. But what even *are* anonymous errors?

Lets look at an actual example first before continuing with the theory:

```rs
use Core.print

def crash():
	throw error.Crash("Custom Message");

def main():
	crash() catch err:
		print($"err.type_id = {err.type_id}\n");
		print($"err.value_id = {err.value_id}\n");
		print($"err.message = {err.message}\n");
```

This program will print these lines to the console:

> ```
> err.type_id = 0123456789 // FIX THE ID WITH THE CORRECT ID EVENTUALLY
> err.value_id = 0
> err.message = Custom Message
> ```

But how do anonymous errors even work? Well, firstly anonymous errors have no underlying error set type visible to the programmer, like when defining your own error set types. This means that it is not possible to tell which error was thrown when throwing anonymous errors, only **that** an error has happened. Also note that we can still access the fields `type_id`, `value_id` and `message` on an error of type `anyerror`. The error structure did not change at all, as you know already. When using anonymous errors, the compiler will just "make up" a name for an error set on a per-function basis. This means that, if you would throw a few anonymous errors within the same function, all those anonymous errors would actually end up in the same internal error set type:

```rs
use Core.print

def crash(i32 v):
	switch v:
		0: throw error.Crash("Custom Message");
		1: throw error.CrashOther;
		else: throw error.CrashLast("LAST");

def print_crash(i32 v):
	crash(v) catch err:
		print($"err.type_id = {err.type_id}\n");
		print($"err.value_id = {err.value_id}\n");
		print($"err.message = {err.message}\n");

def main():
	print_crash(0);
	print("\n");
	print_crash(1);
	print("\n");
	print_crash(2);
	print("\n");
```

This program will print these lines to the console:

> ```
> err.type_id = 0
> err.value_id = 0
> err.message = Custom Message
>
> err.type_id = 0
> err.value_id = 1
> err.message = 
>
> err.type_id = 0
> err.value_id = 2
> err.message = LAST
> ```

As you can clearly see in the output of this example, the `type_id` is identical, but the `value_id` differs, because all those error values `[Crash, CrashOther, CrashLast]` are paret of the same error set. It would be called: `__flint_type_anonymous_err__print_crash__i32__void`. That's quite a long name, I know, but it's just internal annyway. It starts with `__flint` because *nothing* user-defined is allowed to start with this. All Flint-internal things start with this prefix, actually. Then there is `type` to signify it's a type and then `anonymous_err`. Then comes the name of the function in which to create the anonymous error in followed by all return types, separated by one `_` and then followed by all return types of the function. So, we have the full function singature encoded in the type, and we need that actually for overloading. So, under the hood the error set:

```rs
error __flint_type_anonymous_err__print_crash__i32__void:
	Crash, CrashOther, CrashLast;
```

is created. So, there is actually nothing "magical" about anonymous errors whatsoever.
