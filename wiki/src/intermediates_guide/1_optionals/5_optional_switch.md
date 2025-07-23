# Switching on Optionals

We can also switch on optional values to gain access to their stored value as well. The syntax for switching on optionals is a bit different than the syntax on switching on enums. The `switch` statement and expression have different syntax based on the type they switch on, it is the only statement in Flint where this is true (except for the pipe operator `|>`). But let's have a look at a simple example:

```rs
use Core.print

def main():
	i32? maybe = none;
	
	switch maybe:
		none: print("none\n");
		v: print($"value = {v}\n");
	
	maybe = 69;
	switch maybe:
		none: print("none\n");
		v: print($"value = {v}\n");
```

This program will print these lines to the console:

> ```
> none
> value = 69
> ```

As you can see, we have one switch branch for the `none` case, where there isn't anything stored in the optional value at all, and we have one case for the value case. But what is that `v` there? `v` is like a "variable declaration" here, it's just a name we give to access the value field of the optional directly. Note that the type of the `v` "variable" is `i32` here, so we can not set the variable `maybe` to be `none` through the `v` variable.

But what we can do is do a little "trick". You see, the variable `v` gives us a direct mutable reference to the value field of `maybe`, it's not simply a *copy* of the value field, it's a *reference* to it, as seen in the next code example:

```rs
use Core.print

def main():
    i32? maybe = 30;
    print($"value = {maybe!}\n");

    switch maybe:
        none: print("none\n");
        v: v = 10;
    print($"value = {maybe!}\n");
```

This program will print these lines to the console:

> ```
> value = 30
> value = 10
> ```

So, this mutability actually allows us to circumvent Flint's safety mechanisms around accessing the value field of an empty optional variable, which is rather interesting:

```rs
use Core.print

def main():
	i32? maybe = 30;
	
	switch maybe:
		none: print("none\n");
		v:
			print($"v = {v}\n");
			maybe = none;
			print($"v = {v}\n");
```

This code will print these lines to the console:

> ```
> v = 30
> v = 0
> ```

So, you are not allowed to access the value when there is nothing stored on it but if there *was* something stored on it and you *still* have the reference to the value field you can actually still modify it. Maybe we will add a system to detect and prevent this behaviour, but it's very funny in my opinion that you can do it at all.
Also, this is a great example to showcase the behaviour of the `none` assignment we have talked about earlier, that the `none` literal is literally a zeroinitializer of the given type it is meant to be stored at. In our `i32?` example that's not a big deal, the value is just set to 0, but think about what happens if that would have been a `str?`. Strings are not "stack"-allocated in Flint, so they are pointers under the hood. And all values set to 0 interpreted as a pointer is a `nullptr`, so accessing the value would crash our program, but with a mysterious `Segmentation Fault` instead.

So, keep your eyes open for this "bug" (or "feature" if you will) as it could be not what you would want. In this simple example it is clear that we should not do `maybe = none`, but what if that would be a function call instead and somewhere down the line the optional is set to `none` and then we try to use the value `v` after the call? That's where the problems start to happen. So, as a general rule of thumb: Try avoiding the variable which is switched on within the value block of the switch entirely, you should *only* access the value field directly, not the switched-on variable. (Maybe we could make this into a compiler-rule, as this then would not be a runtime-check but a compile-time check to see if the variable that's switched on is accessed in the value-block).

We can also put the switch statement in a separate function entirely and pass the optional value to said function. The optional value will be passed by reference, not by value, so this means that any modifications to the optional will be visible at the callers side as well:

```rs
use Core.print

def print_opt(i32? value):
	switch value:
		none: print("none\n");
		v: print($"value = {v}\n");

def set_value(mut i32? opt, i32 value):
	opt = value;

def main():
	i32? maybe = none;
	print_opt(maybe);

	maybe = 69;
	print_opt(maybe);

	set_value(maybe, 20);
	print_opt(maybe);
```

This program will print these lines to the console:

> ```
> none
> value = 69
> value = 20
> ```

