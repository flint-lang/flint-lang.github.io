# Signatures

It is **only** allowed to link functions with a matching *name*. So, in the example from the last chapter, we *could* write

```ft
	link:
		IMove::move -> FMovable::print_pos,
		IMove::print_pos -> FMovable::move;
```

but this will result in this compilation error:

> ```
> Parse Error at main.ft:22:9
> └──┬┤E0000│
> 18 │ entity Player:
> 21 │ »   link:
> 22 │ »   »   IMove::move -> FMovable::print_pos,
> ┌──┴─────────┘
> └─ Linking functions with different names is not allowed
> ```

Just like it's not allowed that the *names* of the linked functions differ, their explicit signature also must match while their implicit signature **is allowed to differ**. You can see this in the above example, the `IMove::move` function has an implicit signature of `move() -> void` but the `FMovable::move` function has a signature of `move(mut DPosition) -> void`, so their **implicit** signatures differ, even in the above example. If the signatures of the functions would need to match *exactly* (even the implicit parameters), then it would mean that the `IMove` interface would already need to know about `DPosition`, which would defeat the entire purpose of it.

If we, for example, would change the `FMovable` func-module to something like this:

```ft
func FMovable requires(DPosition d):
	def move(i32 value):
		d.pos += value;
```

but keep the rest of the code as-is (the working example from the previous chapter), then we would get this compilation error:

> ```
> Parse Error at main.ft:22:9
> └──┬┤E0000│
> 18 │ entity Player:
> 21 │ »   link:
> 22 │ »   »   IMove::move -> FMovable::move,
> ┌──┴─────────┘
> ├─ Linking functions with different explicit signatures is not allowed
> ├─ Left signature: move()
> └─ Right signature: move(i32)
> ```

because the *explicit* signatures of the functions now differ, `IMove::move` expects no parameters while `FMovable::move` now expects a single `i32` parameter.
