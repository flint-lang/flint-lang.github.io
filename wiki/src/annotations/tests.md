# tests

This section contains all annotations which can be applied to `test` definitions. Here is a list of all available annotations:

- [#test_should_fail](#test_should_fail)
- [#test_performance](#test_performance)
- [#test_output_always](#test_output_always)
- [#test_output_never](#test_output_never)
- [#test_init](#test_init)
- [#test_deinit](#test_deinit)
- [#test_pre](#test_pre)
- [#test_post](#test_post)

## `#test_should_fail`

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

## `#test_performance`

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

## `#test_output_always`

Whether the test should also output it's captured output even if it succeeds.

```ft
use Core.assert
use Core.print

#test_output_always
test "Always printing output":
	print("Wahooo\n");
	print("Wololololo\n");

test "You should see nothing":
	print("Wahooo\n");
	print("Wololololo\n");

#test_performance
test "You should see this output":
	print("Yeah this test will fail\n");
	print("ERROR: no just kidding\n");
	assert(false);

def main():
	print("Compile with the '--test' flag!\n");
```

when compiled using `flintc main.ft --test` the `test` binary should have this output:

> ```
> main.ft:
>  ├─ Always printing output     ✓ passed
>  │   ├─ Output ───┐
>  │   │ Wahooo     │
>  │   │ Wololololo │
>  │   └────────────┘
>  ├─ You should see nothing     ✓ passed
>  └─ You should see this output ✗ failed
>      ├─ Output ─────────────────┐
>      │ Yeah this test will fail │
>      │ ERROR: no just kidding   │
>      ├──────────────────────────┘
>      └─ Test took 0.004068 ms
>
> ✗ 1 test failed!
> ```

## `#test_output_never`

Whether the test should not output it's captured output even if it fails. This annotation, in combination with the `#test_output_never` annotation has a very interesting side-effect: Since the `#test_output_always` annotation toggles whether the test outputs on *success* and the `#test_output_never` annotation toggles whether the test outputs on *failure*, using both annotations on the same test leads to the output printing being flipped, now only printing when it succeeds but staying silent when it fails.

## `#test_init`

The `#test_init` annotation is used to mark a test which is executed **once** at the *beginning* of testing a file. It is executed before any other test of the file runs. Think of it as a setup of tests, for example making sure that some directory is empty etc.

```ft
use Core.assert

shared data G:
	i32 x = 0;

#test_init
test "init":
	// Some theorethical setup
	G.x = 10;

test "The actual test":
	assert(G.x == 10);
```

It is recommended to name this test `"init"` even though the name of the test does *not* matter. It is only allowed to define **one** such test per file. When you execute the test file, the `init` test does **not** show up in the test list:

> ```
> main.ft:
>  └─ The actual test ✓ passed
>
> ✓ All tests passed!
> ```

If the `init` test fails the file is marked as failing and no other test in the file will ever be executed:

> ```
> main.ft:
>  └─ init            ✗ failed (init)
>      ├─ Output ─┐
>      └──────────┘
>
> ✗ 1 test failed!
> ```

In the above example the content of the `init` test was changed to `assert(false);`. As you can see, the output of the `init` test is captured like every other test. The output / performance changing annotations have *no* effect on `init`, `deinit`, `pre` or `post` tests. To make clear that the `init` test failed, the `(init)` text is added to the `failed` text, so even if the test is named something arbitrary, it is always clear that the init stage failed.

## `#test_deinit`

The `#test_deinit` annotation is used to mark a test which is executed **once** at the *end* of testing a file. It is executed after any other test of the file ran. Think of it as a teardown of tests, for example making sure that some directory is emptied or some state is reset etc.

```ft
use Core.assert

shared data G:
	i32 x = 10;

#test_deinit
test "deinit":
	// Some theorethical teardown
	G.x = 0;

test "The actual test":
	assert(G.x == 10);
```

It is recommended to name this test `"deinit"` even though the name of the test does *not* matter. It is only allowed to define **one** such test per file. When you execute the test file, the `deinit` test does **not** show up in the test list:

> ```
> main.ft:
>  └─ The actual test ✓ passed
>
> ✓ All tests passed!
> ```

If the `deinit` test fails its failing output will be appended to the list of tests, even though it does not show up when everything was okay:

> ```
> main.ft:
>  ├─ The actual test ✓ passed
>  └─ deinit          ✗ failed (deinit)
>      ├─ Output ─┐
>      └──────────┘
>
> ✗ 1 test failed!
> ```

In the above example the content of the `deinit` test was changed to `assert(false);`. As you can see, the output of the `deinit` test is captured like every other test. The output / performance changing annotations have *no* effect on `init`, `deinit`, `pre` or `post` tests. To make clear that the `deinit` test failed, the `(deinit)` text is added to the `failed` text, so even if the test is named something arbitrary, it is always clear that the deinit stage failed.

## `#test_pre`

The `#test_pre` annotation is used to mark a test which is executed *once* before **every** other regular test in the file:

```ft
use Core.assert

shared data G:
	i32 x = 10;

#test_pre
test "pre":
	// Some theorethical per-test setup
	G.x++;

test "Test 1":
	assert(G.x == 11);

test "Test 2":
	assert(G.x == 12);
```

It is recommended to name this test `"pre"` even though the name of the test does *not* matter. It is only allowed to define **one** such test per file. When you execute the test file, the `pre` test does **not** show up in the test list:

> ```
> test_files/test_minimal.ft:
>  ├─ Test 1 ✓ passed
>  └─ Test 2 ✓ passed
> 
> ✓ All tests passed!
> ```

If the `pre` test fails its failing output will be shown instead of the output of the regular test where it failed:

> ```
> main.ft:
>  ├─ Test 1 ✗ failed (pre)
>  │   ├─ Output ─┐
>  │   └──────────┘
>  └─ Test 2 ✗ failed (pre)
>      ├─ Output ─┐
>      └──────────┘
> 
> ✗ 2 tests failed!
> ```

In the above example the content of the `pre` test was changed to `assert(false);`. As you can see, the output of the `pre` test is captured like every other test. The output / performance changing annotations have *no* effect on `init`, `deinit`, `pre` or `post` tests. To make clear that the `pre` test failed, the `(pre)` text is added to the `failed` text, so even if the test is named something arbitrary, it is always clear that the pre stage failed.

## `#test_post`

The `#test_post` annotation is used to mark a test which is executed *once* after **every** other regular test in the file:

```ft
use Core.assert

shared data G:
	i32 x = 10;

#test_post
test "post":
	// Some theorethical per-test teardown
	G.x++;

test "Test 1":
	assert(G.x == 10);

test "Test 2":
	assert(G.x == 11);
```

It is recommended to name this test `"post"` even though the name of the test does *not* matter. It is only allowed to define **one** such test per file. When you execute the test file, the `post` test does **not** show up in the test list:

> ```
> main.ft:
>  ├─ Test 1 ✓ passed
>  └─ Test 2 ✓ passed
>
> ✓ All tests passed!
> ```

If the `post` test fails its failing output will be shown instead of the output of the regular test where it failed:

> ```
> main.ft:
>  ├─ Test 1 ✗ failed (post)
>  │   ├─ Output ─┐
>  │   └──────────┘
>  └─ Test 2 ✗ failed
>      ├─ Output ─┐
>      └──────────┘
> 
> ✗ 2 tests failed!
> ```

In the above example the content of the `post` test was changed to `assert(false);`. As you can see, the output of the `post` test is captured like every other test. The output / performance changing annotations have *no* effect on `init`, `deinit`, `pre` or `post` tests. To make clear that the `post` test failed, the `(post)` text is added to the `failed` text, so even if the test is named something arbitrary, it is always clear that the pre stage failed.

Since the `post` test did not increment `G.x` by one, `Test 2` fails regularly. As you can see, the `post` test is only executed when the test succeeds. For failing tests the `post` test is skipped entirely. That's the reason you see the `(post)` in the first test but not the second one.
