# Error Context

Next up will be the topic of error context. The error context is a simple string message which will be passed alongside / inside the error structure. We already have talked about the error structure itself, so now we can talk about what that `message` field really is. With every error you throw you have the additional ability to pass in a string message, the context of the thrown error. You can also define default messages for the case that no message is added in the throw. Below is an example of it all:

```rs
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
				print($"type_id = {e.type_id}\n");
				print($"value_id = {e.value_id}\n");
				print($"message = {e.message}\n");
			anyerror(e): print("is anyerror\n");

def main():
	print_err(false);
	print("\n");
	print_err(true);
```

This program prints these lines to the console:

> ```
> type_id = 803109534
> value_id = 2
> message = Special Error 1
>
> type_id = 803109534
> value_id = 3
> message = Overwritten message: true
> ```

As you can see, the default message from the error set definition is being stored in the returned error by default, but when providing a custom message the provided message is passed within the thrown error structure instead. You may also be able to recognize that **any** expression can be put in between the parenthesis of the throw. So, even calls or variables or string interpolation, it really just does not matter, the result just has to be of type `str`. You can use the `message` field to pass in an error context in the thrown error.
