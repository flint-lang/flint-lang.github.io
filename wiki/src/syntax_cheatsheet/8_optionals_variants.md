# Optionals & Variants

## Optionals

Nullable type, written inline as `T?`. There is no implicit nullability as values are always initialized.

```ft
// 'none' is void? (zeroinitializer)
i32? maybe = none;
maybe = 69;
```

### Unwrapping

```ft
// force-unwrap; hard-crashes on none
i32 v = maybe!;
```

Behaviour on empty access is configurable (`flintc --optional <mode>`).

### Comparing

```ft
if maybe == none:
    ...
if maybe != none:
    ...

i32? a = 5;
i32? b = 5;
// equal if both none or both hold matching values
if a == b:
    ...
```

### Null Coalescing

```ft
// T? ?? T -> T; never crashes
i32 x = maybe ?? 0;
```

### Switching

```ft
switch maybe:
    none: print("none\n");
    v:    print($"value = {v}\n");
```

`v` is a **mutable reference** to the value field (assigning `v = 10` writes the optional). Don't touch the switched-on variable inside the value branch, the reference stays valid after `maybe = none`.

### Optional Chaining

```ft
// T? -> T?; none if any step was none
i32? x = v2m?.x;

// mix: force-unwrap nm, chain v2m
nm!.v2m?.x;
```

The chain result is always the rightmost type wrapped in an optional, e.g. `T?`.

### Optionals as References

Complex types in optionals are DIMA-backed references:

```ft
MyData? ref = md;

// mutates md
ref!.(x, y) = (7, 6.28);

MyData? ref2 = none;
if true:
    MyData val = MyData(10, 3.14, "segfault");
    // outlives the scope, refcount bumped
    ref2 = val;
```

## Variants

Tagged unions. Storage: `{ u8 active_type, byte[N] }` sized to the largest possible type.

```ft
variant MyVariant:
    i32, f32, u64;

def main():
    MyVariant var = i32(5);
    var = f32(3.4);
    var = u64(55);
```

### Switching

```ft
switch var:
    i32(i): print($"i32: {i}\n");
    f32(f): print($"f32: {f}\n");
    u64(u): print($"u64: {u}\n");
```

The accessor names are branch-scoped. Variants are passed **by reference**. Assigning a tuple into a variant requires a temp tuple variable.

### Tagged Variants

```ft
use Core.print

variant MyVariant:
    Int(i32),
    Float(f32),
    Tuple(i32, f32, bool8),
    Empty(void);

def main():
    MyVariant var = MyVariant.Int(-5);
    var = MyVariant.Tuple(5, 6.9, bool8(u8(33)));

    switch var:
        MyVariant.Int(i):   print($"i = {i}\n");
        MyVariant.Float(f): print($"f = {f}\n");
        MyVariant.Tuple(t): print($"({t.$0}, {t.$1}, {t.$2})\n");
        MyVariant.Empty():  print("is empty\n");
```

Tags must always be qualified (`MyVariant.Int`) to disambiguate from types. Empty payload: `Empty(void)`; construct/switch as `MyVariant.Empty()`.

### Inline Variants

```ft
def print_var(variant<i32, f32, str> var):
    switch var:
        i32(i): ...
        str(s): ...

def main():
    variant<i32, f32, str> var = i32(-55);
    print_var(var);
```

Inline variants cannot be tagged, so switches must name the types.

### Comparing

```ft
// does it hold an i32?
if var == i32:
    ...

// tagged check
if var == MyVariant.Int:
    ...

// same type AND same value, checked via memcmp
if var_1 == var_2:
    ...

// u8, 1-based, readonly
print($"active = {var.active_type}\n");

// type + value check
if var == i32(7):
    ...
```

### Unwrap & Extract

```ft
// force-unwrap; crashes on wrong type
i32 v = var!(i32);

// extract -> i32?, none if wrong type
i32? v = var?(i32);

// tag form, chains with ?.
i32? x = var?(MyVar.Data).x;
```

### Optional Variants

`T?` where T is a variant is the **same struct** as internal tag `0` is reserved for `none`:

```ft
MyVar? opt = var;

// These two are equal
f32 x = (opt!)!(MyVar.Float);
f32 y = opt!!(MyVar.Float);
```
