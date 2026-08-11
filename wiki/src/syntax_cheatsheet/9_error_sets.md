# Error Sets

Every Flint function can fail; the error is an implicit **first** return value of every function. No exceptions, the error path is compiled into the call/return code.

## Defining & Throwing

```ft
error ErrSet:
    Value1, Value2;

def fail():
    throw ErrSet.Value1;
```

Errors are a set type; values look like enum tags.

## Catching

```ft
fail() catch err:
    print("Error catched!\n");
```

Catching consumes the error; execution continues normally after the `catch`.

## Refinement

An error set can extend another, becoming a superset:

```ft
error ErrBase:
    B1, B2;

// contains B1, B2, S1, S2
error ErrSpecial(ErrBase):
    S1, S2;
```

`anyerror` is the null-set (root). Every set implicitly extends `anyerror` if not extending any other error, so any error can be "cast" to `anyerror`. The tree relation is compile-time only.

## Function Signatures

```ft
def divide(i32 x, i32 y) -> i32 {ErrArithmetic}:
    if y == 0:
        throw ErrArithmetic.NullDivision;
    return x / y;
```

- `{ErrSet}` after the return type declares the possible errors; multiple: `{A, B}`.
- Without it, the function's error return is `anyerror?`.
- With it, the error becomes `variant<anyerror, ErrArithmetic>?`, and `err` in the catch is the unwrapped variant:

```ft
i32 res = divide(10, 0) catch err:
    switch err:
        ErrArithmetic(e):
            switch e:
                NullDivision: print("Is NullDivision\n");
                Negative: print("Is Negative\n");
        anyerror(e):
            print("Is anyerror\n");
```

## The Error Structure

Every error is `{ u32 type_id, u32 value_id, str* message }`:

```ft
// hash of the set name (path-dependent; don't hardcode)
type_id := e.type_id;

// index of the thrown value
value_id := e.value_id;

// context string
message := e.message;
```

Prefer casting the error to a string: `str(e)"` -> `ErrArithmetic.NullDivision` (message not included). If you want to include message write `$"{e}: {e.message}"` -> `ErrArithmetic.NullDivision: Tried to divide 10 by 0`.

## Error Context

```ft
error ErrBase:
    B1("Base Error 1"),
    B2("Base Error 2");

def somefn():
    // any str expression
    throw ErrSpecial.S2($"Overwritten message: {override}");
```

Default messages come from the set definition; a custom message overrides them.

## Anonymous Errors

```ft
def crash():
    // no set definition needed 
    throw error.Crash("Custom Message");
```

Anonymous errors share one internal, function-local error set (`error.<fn_id>`); you can only tell that an error happened, not which one.

## Inline Catch

When the catch body is just a switch on the error, drop `err` and the nested switch:

```ft
will_throw() catch:
    ErrInline(b): print("is inline thrown\n");
    anyerror(a):  print("is anyerror\n");
```

Only works if the function names its error types (switching on a bare `anyerror` is impossible).
