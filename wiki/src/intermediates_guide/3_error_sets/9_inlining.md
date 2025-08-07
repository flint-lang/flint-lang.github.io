# Error Switch Inlining

In Flint, the pattern to write

```rs
call() catch err:
	switch err:
		...
```

is very very common. And you may notice that the indentation level of the actual switch is 2 in our case. But because this pattern is so common, and because we actually do not further access `err` at all outside of the `switch` and we most likely do not write anything else in the catch scope other than the `switch`, we have developed a special case syntax for this case:

```rs
use Core.print

error ErrInline:
	Throwing;

def will_throw() {ErrInline}:
	throw ErrInline.Throwing("Wahu");

def main():
	will_throw() catch:
		ErrInline(b): print("is inline thrown\n");
		anyerror(a): print("is anyerror\n");
```

This program will print this line to the console:

> ```
> is inline thrown
> ```

As you notice, we implicitely switch on the error value, which means that the whole `catch:` body becomes the body of the `switch`. The main reason to why we added this is to reduce the nesting level of the code when catching errors. Catching errors is already verbose enough, so reducing the visual clutter to keep you focused on the actual errors you want to catch is important for readability.

Because we switch on the possible error set types (the returned variant) we are actually only able to inline-switch on a function which returns at least one known error type. If the function would only return an `anyerror` as it's error return, then we would not be able to switch on it. Inline-switching is explicitely meant for switching on the `variant<anyerror, ErrInline, ...>` error variant.

So, this code:

```rs
use Core.print

error ErrInline:
	Throwing;

def will_throw():
	throw ErrInline.Throwing("Wahu");

def main():
	will_throw() catch:
		ErrInline(b): print("is inline thrown\n");
		anyerror(a): print("is anyerror\n");
```

will not compile, at all. Because now we switch on the error which is of type `anyerror`, and we **cannot** switch on the `anyerror` type. So, inline-switching is only possible on functions which explicitely name their potential errors they might throw.
