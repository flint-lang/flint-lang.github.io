# Function Signatures

So far we have learned how we can define errors, extend from other errors to form bigger and more specialized sets and how to throw and catch errors, but on the catching side we have not yet done anything with the catched `err` variable. This will change in this chapter, as we dive deeper into how to specify the possible errors a function could throw directly in it's signature. Let's look at a very simple example for this at first:

```ft
use Core.print

error ErrArithmetic:
	NullDivision, Negative;

def divide(i32 x, i32 y) -> i32 {ErrArithmetic}:
	if y == 0:
		throw ErrArithmetic.NullDivision;
	if x < 0 or y < 0:
		// We just made up that error just to have a second error case
		throw ErrArithmetic.Negative;
	return x / y;

def main():
	i32 res = divide(10, 0) catch err:
		print("Error happened\n");
	print($"res = {res}\n");
```

This program will simply print these lines to the console:

> ```
> Error happened
> res = 0
> ```

There is quite a lot going on here, so let's unpack it bit by bit. First, as you can see we have declared which error the function `divide` is able to throw in it's signature. Through the `{ErrArithmetic}` syntax we specify all possible errors the function could throw. It's only allowed to put error set types in between the `{}` symbols. We can put more than one error type in them to signify that the function is capable of throwing these errors. Normally a function would return an error of type `anyerror?` if we do not specify any error here. But by defining the errors we directly change the functions error return type to now be a `variant<anyerror, ErrArithmetic>?`. So, the error this function could throw is now either an `ErrArithmetic` or _something else_. If we specify more than one error type in the signature the variant will become bigger. It's still an optional, but that optional will disappear when catching the error, so the `err` variable is only of type `variant<anyerror, ErrArithmetic>`.

And this is the secret of how to tell which error actually was returned from a function, because now we can simply switch on the `err` variable and handle the error depending on which error it was.

```ft
use Core.print

error ErrArithmetic:
	NullDivision, Negative;

def divide(i32 x, i32 y) -> i32 {ErrArithmetic}:
	if y == 0:
		throw ErrArithmetic.NullDivision;
	if x < 0 or y < 0:
		// We just made up that error just to have a second error case
		throw ErrArithmetic.Negative;
	return x / y;

def main():
	i32 res = divide(10, 0) catch err:
		switch err:
			ErrArithmetic(e):
				print("Is ErrArithmetic\n");
			anyerror(e):
				print("Is anyerror\n");
	print($"res = {res}\n");
```

This program will print these lines to the console:

> ```
> Is ErrArithmetic
> res = 0
> ```

Okay and next up we look at switching on the error set directly. It works just like when switching on enums:

```ft
use Core.print

error ErrArithmetic:
	NullDivision, Negative;

def divide(i32 x, i32 y) -> i32 {ErrArithmetic}:
	if y == 0:
		throw ErrArithmetic.NullDivision;
	if x < 0 or y < 0:
		// We just made up that error just to have a second error case
		throw ErrArithmetic.Negative;
	return x / y;

def main():
	i32 res = divide(10, 0) catch err:
		switch err:
			ErrArithmetic(e):
				print("Is ErrArithmetic\n");
				switch e:
					NullDivision: print("Is NullDivision\n");
					Negative: print("Is Negative\n");
			anyerror(e):
				print("Is anyerror\n");
	print($"res = {res}\n");
```

This program will print these lines to the console:

> ```
> Is ErrArithmetic
> Is NullDivision
> res = 0
> ```
