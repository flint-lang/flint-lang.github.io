# Callables

Callables are function values. They are Thread-Stack-managed: referencing a function allocates its frame on the heap and stores a pointer to the function in front of it.

## The `fn` Type

```ft
// no params, no return
fn<() -> void>

// two params, one return
fn<i32, i32 -> i32>

// multiple returns: no parens
fn<i32, i32 -> i32, i32>
```

Special-case notations:

```ft
// params only, no return (-> void omitted)
fn<i32>

// neither params nor return
fn<>
```

## Function References

```ft
def greet():
    print("Hello, World!\n");

def main():
    // '::' is the reference operator
    fn<() -> void> g = ::greet;
    g();
```

- `Core` module and `extern` functions cannot be referenced (`::print` is an error).
- Callables are freed/overwritten on reassignment; copying a callable clones its frame.

## Callables as Values

Pass, return, and mutate callables like any value:

```ft
def apply_op(fn<i32, i32 -> i32> op, i32 x, i32 y) -> i32:
    return op(x, y);

def get_sub() -> fn<i32, i32 -> i32>:
    return ::sub;

// callables pass by reference
def set_sub(mut fn<i32, i32 -> i32> op):
    op = ::sub;

def main():
    fn<i32, i32 -> i32> op = get_sub();
    i32 res = apply_op(op, 20, 10);
    set_sub(op);
    res = apply_op(op, res, 5);
```

## Persistent Locals

`persistent` keeps local state across calls; per callable instance, not static/shared:

```ft
def counter() -> i32:
    persistent i32 c = 0;
    // '++' not usable in expression contexts yet
    i32 current = c;
    c++;
    return current;

def main():
    fn<() -> i32> c1 = ::counter;
    fn<() -> i32> c2 = ::counter;
    c1(); // 0
    c1(); // 1
    c2(); // 0
```

- Cannot combine `persistent` with `const`.
- Direct calls (`counter()`) reset the state each invocation; only callable instances persist.

Use cases: counters, rate-limiters (with `Core.time`), state machines, accumulators.

## Error Sets in Callables

```ft
// possible errors in the fn type
fn<bool {ErrAssert}> f = ::may_fail;

f(true) catch err:
    switch err:
        ErrAssert(e): print($"ErrAssert = {e}\n");
        anyerror(e):  print($"anyerror = {e}\n");
```

An unspecified error set expands to `{anyerror}`:

```ft
// This expands to the type fn<bool -> void {anyerror}>
fn<bool> f = ::may_fail;
```

so any function reference can be stored regardless of the errors it may throw.
