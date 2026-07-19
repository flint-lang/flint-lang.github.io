# Annotations

Annotations are a way where you can directly communicate with the Flint compiler. Annotations are used for all places where adding explicit syntax for certain things would completely bloat the language and annotations are a lightweight way of communicating with the compiler. There only exist two annotations at the moment, but there will be more annotations added in the future.

An annotation is defined using the `#` symbol. Everything following that symbol is part of the annotation, so there cannot be anything written after an annotation, similar how nothing is able to be written to the right of a single-line comment `//`. Annotations can also be stacked, so more than one annotation can be defined at once to be used for one test.

This chapter contains all (currently supported) annotations. It will expand in the future once more annotations are added to Flint.

## Stacking annotations

All annotations can be stacked. So we could define both `#test_should_fail` and `#test_performance` for the same test:

```ft
use Core.assert

#test_performance
test "Short Test":
	u64 sum = 0;
	for (i, _) in 0..1_000_000:
		sum += 1;

#test_should_fail
#test_performance
test "Long Test":
	u64 sum = 0;
	for (i, _) in 0..1_000_000_000:
		sum += 1;
		assert(sum < 100_000_000);
```

This program will print something like these lines to the console:

> ```
> test_files/test_minimal.ft:
>  ├─ Short Test ✓ passed
>  │   └─ Test took 1.760641 ms
>  └─ Long Test  ✓ passed
>      └─ Test took 405.461352 ms
>
> ✓ All tests passed!
> ```

As you can see, the failing test now succeeds, as both annotations are used for the same test.

## Annotation consumption

If a definition, statement etc is unable to **consume** an annotation defined right before it, a compile error is thrown. This makes sure that only consumable annotations are used. This is also the reason to why this chapter is split into sections, since test-specific annotations only work on defined tests, for example.
