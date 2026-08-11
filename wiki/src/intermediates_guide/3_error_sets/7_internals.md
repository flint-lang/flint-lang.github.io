# Internals

There are still some things to cover, especially around the internals of the error handling system. You have seen the `variant<anyerror, ErrSpecial>?` type earlier and you surely have wondered how this type looks under the hood. If it would be *any* other type it would look just like the variant directly (as described in the optional variants chapter):

```c
struct {
	u8 variation;
	byte[16] data;
}
```

The above representation, however, is *not* how any error is actually layed out in memory. We use the exact same trick we did for integrating the `none` case into the variant for optional variants here. Because what does the `variation` above even tell us? It tells us which error type it was. So, it tells us no new information compared to the `type_id` field of the error itself. This means that we can integrate the entire variation byte directly into the error type itself so even an optional variant of possible error types returned from a function has still the same underlying structure:

```c
struct {
	u32 type_id;
	u32 value_id;
	str *message;
}
```

The function which is responsible to give out type IDs in Flint is designed in a way that `type_id==0` is impossible. This means that `type_id=0` is used as our "optional" `none` case, e.g. "there was no error"! So this means that when we switch on an error to find out which error type it is, we just switch on the type id directly. So, when we write

```ft
switch err:
	ErrSpecial(e): ...
	anyerror(e): ...
```

all type IDs are known at compile-time so the type ids are directly inlined. But what does the `anyerror` branch become? The `anyerror` has no distinct type ID, the `anyerror` just means any error. When switching on an error variant this becomes *any other error*... so, the `anyerror` case is the `else` case of the switch!

So, to summarize: The `variant<anyerror, ErrSpecial>?` type boils down to be **just the simple 16 Byte error structure that we already know about**. So, everything from the error value itself to the set to the variant to the optional variant is **all** the same structure under the hood, which makes it very efficient.

This also imposes a unique side effect... we can not mix error types in variants of "normal" types. I think that this is a good thing, as this means that we are *only* allowed to define variants which contain *either* only error set types *or* "normal" types and we are not allowed to mix and match them as we whish. That's a trade-off for sure, but the gains are a vastly simpler and more efficient error handling system, which is always a good thing.
