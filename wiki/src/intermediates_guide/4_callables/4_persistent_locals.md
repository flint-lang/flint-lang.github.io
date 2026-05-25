# Persistent Locals

Because of Flints unique approach to execution thanks to the Thread Stack, callables have yet another very nice feature: local variable persistence. You know the basics of the Thread Stack and thus you know that a callable functions frame stays valid even after a call. The overall frame **persists** across calls.

This core property, that the frame of a callable persists across calls, is the basis of persistent local variables. Unlike the `static` keyword of other languages like `Java` or `C++`, a variable marked as `persistent` is *not* shared across functions or callable instances. Every `persistent` local variable persists across function calls on a per-callable instance basis, which is *very* different from the `static` keyword of other languages.

Persistent locals enable clean, encapsulated state without global variables or complex object patterns.

Persistent locals can be used across a wide variety of things:

- Counters and accumulators
- Caches / memoization (once Flint has support for maps)
- Rate-limiters / throttlers
- State machines
- Event handlers with memory

## Counters

Lets start with the easiest use-case first, counters:

```ft
use Core.print

def counter() -> i32:
    persistent i32 c = 0;
    // ++ does not work in expression contexts yet
    i32 current = c;
    c++;
    return current;

def main():
    fn<() -> i32> c1 = ::counter;
    fn<() -> i32> c2 = ::counter;
    print($"c1() = {c1()}\n");
    print($"c1() = {c1()}\n");
    print($"c2() = {c2()}\n");
    print($"c2() = {c2()}\n");
    print($"c1() = {c1()}\n");

    print($"counter() = {counter()}\n");
    print($"counter() = {counter()}\n");
```

This program will print these lines to the console:

> ```
> c1() = 0
> c1() = 1
> c2() = 0
> c2() = 1
> c1() = 2
> counter() = 0
> counter() = 0
> ```

As can be seen, the `persistent` storage modifier keyword (similar to how `const` is a storage modifier keyword). It is not allowed to use `persistent` together with `const` on a local variable, because why would the local variables state need to persist if it's constant? A persistent constant value would be the equivalent of just a regular constant value, just use `const data` for this use case instead.

When calling a function with `persistent` local variables through a "regular" call (`counter()`) then the persistent value will not "remember" its previous state. The persistent state of a persistent local variable exists as long as the callable frame exists.

## Rate-Limiter

Another use case, other than just simple counters, is to use persistent locals in combination with callables when you want to execute a given function in a fixed time frame, for example a physics update function in a game or something similar. So, every time you want a *cooldown* or *rate-limiter*, you can use the persistent locals for a time stamp the function executed something the last time, and update only if enough time has passed.

```ft
use Core.print
use Core.time

def execute_function():
	print("Executed\n");

def execute_maybe(fn<> function) -> bool:
	persistent TimeStamp last = now();
	TimeStamp current = now();
	Duration elapsed = duration(last, current);

	if as_unit(elapsed, TimeUnit.S) < 1.0:
		return false;

	function();
	last = current;
	return true;

def main():
	fn<> task = ::execute_function;
	fn<fn<> -> bool> throttled = ::execute_maybe;
	i32 c = 0;
	while c < 4:
		if throttled(task):
			c++;
```

This program will print these lines to the console:

> ```
> Executed
> Executed
> Executed
> Executed
> ```

Every line printed to the console will have a delay of 1 second from the last line respectively. We are not limited to one single timer, however. The possibilities are endless, I bet you will get creative with local variable persistence!

## State Machines

A very good example use-case for persistent locals are state-machines. Depending on the state a state-machine is currently in, it may need to behave differently. Through persistent locals, this state is function-local and very managable mentally.

```ft
use Core.print

enum State:
	S1, S2, S3;

def execute_next_phase():
	persistent State state = State.S1;
	switch state:
		S1:
			print("Executed State 1\n");
			state = State.S2;
		S2:
			print("Executed State 2\n");
			state = State.S3;
		S3:
			print("Executed State 3\n");
			state = State.S1;

def main():
	fn<> state_handler = ::execute_next_phase;
	for (_, _) in 0..6:
		state_handler();
```

This program will print these lines to the console:

> ```
> Executed State 1
> Executed State 2
> Executed State 3
> Executed State 1
> Executed State 2
> Executed State 3
> ```

There is no explicit state-object which needs to be stored or passed around to the function. It "remembers" in which state it currently is, so the function itself manages it's state and delegates its work depending on it. This is only a simple example, but the same principle could be applied to any function in any context.

Such contextful functions and functions which rely heavily on persistent locals need callable instances to work correctly. If the `execute_next_phase` was called directly, then only the first state would be executed over and over again. It is still open to discussion whether this is just a regular consequence of the design or functions should not lean too hard onto local variable persistence. Maybe adding a `#function_only_callable` annotation would help here and prevent any direct-calls to that function at compile-time.

## Accumulators

Another use-case of persistent local variables are accumulators. Accumulators are useful if you want to collect results or keep calculating with the last result. The below example is not *that* useful, as you could in theory just replace the entire `accumulator` function with a simple `i32` variable in the `main` function, but it's just to get the concept across:

```ft
use Core.print

def add(i32 x, i32 y) -> i32:
	return x + y;

def sub(i32 x, i32 y) -> i32:
	return x - y;

def mul(i32 x, i32 y) -> i32:
	return x * y;

def div(i32 x, i32 y) -> i32:
	return x / y;

def accumulator(fn<i32, i32 -> i32>? operation, i32 y) -> i32:
	persistent i32 x = 0;
	switch operation:
		none:
			return x;
		op:
			x = op(x, y);
			return x;

def main():
	operations := fn<i32, i32 -> i32>[4](::add);
	operations[1] = ::sub;
	operations[2] = ::mul;
	operations[3] = ::div;

	a := ::accumulator;
	for (i, op) in operations:
		i32 r = a(op, i32(10 - i));
		print($"applying '{10 - i}' to accumulator results in: {r}\n");
	i32 result = a(none, 0);
	print($"result = {result}\n");
```

This program will print these lines to the console:

> ```
> applying '10' to accumulator results in: 10
> applying '9' to accumulator results in: 1
> applying '8' to accumulator results in: 8
> applying '7' to accumulator results in: 1
> result = 1
> ```

Persistent locals are a concept which, as far as I am aware, does not exist yet in any other language. The closest analogy would be closures with mutable captured state, but even this is not the exact same thing. This behaviour can be simulated by passing a "context" parameter to the function, and then the function would become stateful, but that's not a 1:1 comparison, as this manual state-passing approach would be very...manual.
