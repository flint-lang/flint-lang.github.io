# Error Sets in Callables

As you know, *every* user-defined function in Flint is able to throw an error, it's part of the base structure of the function frame. Because *every* function can throw, this also becomes true for callables. A callable can return an error just like a regular function call is able to:

```rs
use Core.assert
use Core.print

def may_fail(bool fail) {ErrAssert}:
	print($"fail = {fail}\n");
	assert(not fail);

def main():
	fn<bool> f = ::may_fail;
	f(false);
	f(true);
```

This program will print these lines to the console:

> ```
> fail = false
> fail = true
> The given error bubbled up to the main function:
>  └─ ErrAssert.AssertionFailed: "The assertion has failed"
> ```

As you can see, the callable call `f(true);` failed and let the error bubble up to the main function. You can also see that the type of `f` is *not* the same as the type of the function `may_fail`. The function `may_fail` has the type `fn<bool -> void {ErrAssert}>`. The `-> void` can be omitted, so it has the type of `fn<bool {ErrAssert}>` but we store it on a callable of type `fn<bool>`, how is that possible?

Simply said: the frame structure is the exact same anyways, and because the error `ErrAssert` is a specialized error set of the `anyerror` set, we can store it on a `fn<bool>`. What happens when we define a fn type like `fn<bool>` is that Flint will expand that type to this type, actually: `fn<bool -> void {anyerror}>`. So, it's a function which takes a bool, returns nothiing, and might throw any error. This means that we can store any function reference on that callable, independent of that referenced functions possible thrown error sets.

## Specifying the error sets

Just as it is possible to define which error sets a function is able to throw, it is also possible to define this information in the `fn` type itself. For this, the possible error sets just have to be added after the return type, just like you do when defining a function:

```rs
use Core.assert
use Core.print

def may_fail(bool fail) {ErrAssert}:
	print($"fail = {fail}\n");
	assert(not fail);

def main():
	fn<bool {ErrAssert}> f = ::may_fail;
	f(false);
	f(true);
```

This program will print these lines to the console:

> ```
> fail = false
> fail = true
> The given error bubbled up to the main function:
>  └─ ErrAssert.AssertionFailed: "The assertion has failed"
> ```

As you can see, nothing changed because we did not catch the error.

## Catching callables

But watch what happens when we now write a catch after the **callable call**:

```rs
use Core.assert
use Core.print

def may_fail(bool fail) {ErrAssert}:
	print($"fail = {fail}\n");
	assert(not fail);

def main():
	fn<bool {ErrAssert}> f = ::may_fail;
	f(false) catch err:
		switch err:
			ErrAssert(e):
				print($"ErrAssert = {e}\n");
			anyerror(e):
				print($"anyerror = {e}\n");
	f(true) catch err:
		switch err:
			ErrAssert(e):
				print($"ErrAssert = {e}\n");
			anyerror(e):
				print($"anyerror = {e}\n");
```

This program will print these lines to the console:

> ```
> fail = false
> fail = true
> ErrAssert = ErrAssert.AssertionFailed
> ```

Just like that, specific error types now can be catched and handled accordingly from **a callable**. Remember: you can store any function frame on that callable variable `f` as long as the signature matches up!
