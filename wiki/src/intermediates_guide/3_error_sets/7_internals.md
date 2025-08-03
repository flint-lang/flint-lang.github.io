# Internals

There are still some things to cover, especially around the internals of the error handling system. You have seen the `variant<anyerror, ErrSpecial>?` type earlier and you surely have wondered how this type looks under the hood. If it would be *any* other type it would look something like this:

```c
struct {
	bool has_value;
	struct {
		u8 variation;
		byte[16] data;
	} value;
}
```

But i think it is needless to say how inefficient and utterly stupid this all would be. Lets look at it in detail. Let's unpack it from inside out, so lets actually start at the variant first. In a variant we have a 8 bit number determining which variation it actually is. In our case this would mean `0` for `anyerror` and `1` for the `ErrSpecial` case. However, we have the `type_id` field of our error structure. This field directly encapsulates all the needed information, as it contains the information which error set **type** it is. This means that we can completely erase the whole "variant" part entirely. Good, then what does a switch on an error variant actually do? It just switches on the `type_id` field of the error value directly.
So, when we write

```rs
switch err:
	ErrSpecial(e): ...
	anyerror(e): ...
```

all type IDs are known at compile-time so the type ids are directly inlined. But what does the `anyerror` branch become? The `anyerror` has no distinct type ID, the `anyerror` just means any error. When switching on an error variant this becomes *any other error*... so, the `anyerror` case is actually the `else` case of the switch!

And now let's move on to the outer part of the `variant<anyerror, ErrSpecial>?` type, the optional. The hashing function of Flint's errors is written in a way to make it **impossible** to have a result type id of `0`. This works by actually calculating a `31` bit hash and then just shifting all bits of the result hash one to the left. If the result would happen to be `0` it becomes `1`. This way it is **guaranteed** for the `type_id` to be inequal to 0. This was not implemented this way by accident or anything, but by design. Because now we can use the `type_id == 0` to represent the "no error" case, the `none` case of the optional!

So, as you might have guessed by now: The type `variant<anyerror, ErrSpecial>?` actually boils down to be **just the simple 16 Byte error structure that we already know about**. So, everything from the error value itself to the set to the variant to the optional variant is **all** the same structure under the hood, which makes it very efficient.

This also imposes a unique side effect... we can not mix error types in variants of "normal" types. I think that this is a good thing, as this means that we are *only* allowed to define variants which contain *either* only error set types *or* "normal" types and we are not allowed to mix and match them as we whish. That's a trade-off for sure, but the gains are a vastly simpler and more efficient error handling system, which is always a good thing.
