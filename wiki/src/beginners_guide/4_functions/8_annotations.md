# Annotations

Annotations are a way where you can directly communicate with the Flint compiler. Annotations are used for all places where adding explicit syntax for certain things would completely bloat the language and annotations are a lightweight way of communicating with the compiler. There only exist two annotations at the moment, but there will be more annotations added in the future.

An annotation is defined using the `#` symbol. Everything following that symbol is part of the annotation, so there cannot be anything written after an annotation, similar how nothing is able to be written to the right of a single-line comment `//`. Annotations can also be stacked, so more than one annotation can be defined at once to be used for one test.

This file contains all (currently supported) annotations. It will expand in the future once more annotations are added to Flint.

## test_should_fail

This annotation is used when a test should fail. You can use this when testing an error case and expect that a given operation would lead to a thrown error. If the test does not throw an error then it's considered to be failed:

```ft
use Core.assert

#test_should_fail
test "fails":
    assert(true);

#test_should_fail
test "succeeds":
    assert(false);
```

This program will print these lines to the console:

> ```
> main.ft:
>  ├─ fails    ✗ failed
>  └─ succeeds ✓ passed
> 
> ✗ 1 test failed!
> ```

As you can see, the `#test_should_fail` annotation essentially just inverts the tests.

## test_performance

You can use the `#test_performance` annotation whenever you want to test the performance of a given operation or operation chain. For example when you have a very complex function you can test how long it takes to process various inputs.

```ft
#test_performance
test "Short Test":
	u64 sum = 0;
	for (i, _) in 0..1_000_000:
		sum += 1;

#test_performance
test "Long Test":
	u64 sum = 0;
	for (i, _) in 0..1_000_000_000:
		sum += 1;
```

This program will print something like these lines to the console:

> ```
> main.ft:
>  ├─ Short Test ✓ passed
>  │   └─ Test took 2.438704 ms
>  └─ Long Test  ✓ passed
>      └─ Test took 1349.054036 ms
> 
> ✓ All tests passed!
> ```

### Performance tests as unit tests

A performance test is *also* a unit-test. If the test fails it will be printed as `failed` in the output as well:

```ft
use Core.assert

#test_performance
test "Short Test":
	u64 sum = 0;
	for (i, _) in 0..1_000_000:
		sum += 1;

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
>  │   └─ Test took 1.974890 ms
>  └─ Long Test  ✗ failed
>      └─ Test took 399.604718 ms
> 
> ✗ 1 test failed!
> ```

### Stacking annotations

As mentioned above, annotations can also be stacked. So we could define both `#test_should_fail` and `#test_performance` for the same test:

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
