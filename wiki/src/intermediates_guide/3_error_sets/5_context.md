# Error Context

The error context is a simple string message which will be passed alongside / inside the error structure. We already have talked about the error structure itself, so now we can talk about what that `message` field really is. With every error you throw you have the additional ability to pass in a string message, the context of the thrown error. You can also define default messages for the case that no message is added in the throw. Below is an example of it all:

<div class="warning">

This example sometimes fails to compile when using the `--parallel` flag

If you compile with any other flag, everything is fine, but compiling this program using the `--parallel` flag *may* not compile. It's likely a race condition or something similar in the compiler but I was not able to figure out what exactly it is. This is the only example of the wiki where it *sometimes* happens, but it does not happen reliably enough to find the root cause (yet).

</div>

```ft
use Core.print

error ErrBase:
	B1("Base Error 1"),
	B2("Base Error 2");

error ErrSpecial(ErrBase):
	S1("Special Error 1"),
	S2("Special Error 2");

def throw_error(bool override) {ErrSpecial}:
	if override:
		throw ErrSpecial.S2($"Overwritten message: {override}");
	else:
		throw ErrSpecial.S1;

def print_err(bool override):
	throw_error(override) catch err:
		switch err:
			ErrSpecial(e):
				print($"{e}: \"{e.message}\"\n");
			anyerror(e): print("is anyerror\n");

def main():
	print_err(false);
	print_err(true);
```

This program will print these lines to the console:

> ```
> ErrSpecial.S1: "Special Error 1"
> ErrSpecial.S2: "Overwritten message: true"
> ```

As you can see, the default message from the error set definition is being stored in the returned error by default, but when providing a custom message the provided message is passed within the thrown error structure instead. You may also be able to recognize that **any** expression can be put in between the parenthesis of the throw. So, even calls or variables or string interpolation, it really just does not matter, the result just has to be of type `str`. You can use the `message` field to pass in an error context in the thrown error.

<div class="warning">

It is strongly advised against calling potentially failing functions in the expression when trowing errors.

When those function calls fail themselves the error bubbles up even though you were trying to create a context for a different error. Always try to build up the error message from local context of where and why the error happened.

</div>
