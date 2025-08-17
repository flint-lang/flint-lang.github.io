# Inferring the Error Variant

<div class="warning">

Inferring the error variant return type is not yet implemented.

This feature, while _defintely_ planned, is not implemented yet. This feature becomes _extremely_ useful in the context of function composition and blueprints, so it's considered a "must-have" feature for Flint.

</div>

You have already seen how we explicitely define which possible error sets a function might throw using the `{..}` syntax. To this already known syntax now comes a small inferring-tool. When we write a function it always implicitely returns an `anyerror` if we define nothing else. But, what if we could add a small set of symbols to tell the compiler "put all possible throwing error sets in the return type of the function"? Thats exactly why this chapter exists.

We tell a function to infer all possible error set types through the `{_}` syntax. The `_`, as you already know does **always** mean _default_, _infer_ or _unused_, and it **never** means anything else in Flint. So, it is only logical to use it to infer the possible error set types of a function. Here is a small example showcasing it:

```ft
use Core.print
use Core.assert

error ErrBase:
	Base1, Base2;

error ErrSpecial(ErrBase):
	Special1, Special2;

def do_base(i32 x) {_}:
	if x > 7:
		throw ErrBase.Base2;

def do_something(i32 x) {_}:
	assert(x > 0);
	for i32 i = 0; i < x; i++:
		do_base(i);
		if i > 10:
			throw ErrSpecial.Special1;

def main():
	do_something(13) catch:
		ErrAssert(e):
			print("assertion error thrown\n");
		ErrBase(e):
			print("base error thrown\n");
		ErrSpecial(e):
			print("special error thrown\n");
		anyerror(e):
			print("anyerror thrown\n");
```

This program will print this line to the console:

> ```
> special error thrown
> ```

Well the example isn't as small as i said. Let's go through all functions bit by bit. First, let's talk about the `do_base` function. It only throws the `ErrBase` error set, so it's possible error set types are `{ErrBase}`, nothing more.

The `do_something` function is a bit more complicated. When we look at the function we first come across the `assert` call. The `Core.assert` module provides the `ErrAssert` error set, which will be thrown by the `assert` function. So, the `do_something` function contains at least the `{ErrAssert, ...}` sets. But let's continue reading through the `do_something` function. The next call we can see is `do_base` without any catch on it. The `do_base` function can throw the `{ErrBase}` error set. So, the `do_something` function will inherit this possible error too, so it now has the possible error sets of `{ErrAssert, ErrBase, ...}`.
When we continue reading through the `do_something` function we can also find the `throw ErrSpecial...` line. So, the `do_something` function also may throw the `ErrSpecail` error set, and we have reached the end of the function now. This means that the `do_something` function has the possible error set definition of `{ErrAssert, ErrBase, ErrSpecial}`. These are the three possible errors the function could throw. So, when we inline-switch the error of the function we switch on the error variable which is of type `variant<anyerror, ErrAssert, ErrBase, ErrSpecial>`.

When inferring the error set types there is a general rule of thumb: Every **non-catched** call will directly add it's possible errors to the error set of the function, just like every `throw` statement will, of course. If you would catch an error the possible errors of that call will no longer be part of the error set type. Here is a example of that:

```ft
use Core.print
use Core.assert

error ErrBase:
	Base1, Base2;

error ErrSpecial(ErrBase):
	Special1, Special2;

def do_base(i32 x) {_}:
	if x > 7:
		throw ErrBase.Base2;

def do_something(i32 x) {_}:
	assert(x > 0);
	for i32 i = 0; i < x; i++:
		do_base(i) catch err:
			print("doing nothing\n");
		if i > 10:
			throw ErrSpecial.Special1;

def main():
	do_something(13) catch:
		ErrAssert(e):
			print("assertion error thrown\n");
		ErrSpecial(e):
			print("special error thrown\n");
		anyerror(e):
			print("anyerror thrown\n");
```

This program will print these lines to the console:

> ```
> doing nothing
> doing nothing
> doing nothing
> doing nothing
> special error thrown
> ```

As you can see, the `ErrBase` from the `do_base` function call is no longer part of the possible error sets of the `do_something` function. This feature of inferring the error set types is very powerful, but use it with caution. You should not add it to _every_ function of your codebase and "call it a day". You will learn how to effectively use this feature in later chapters, especially when we take a closer look at Flint's Blueprint system later.
