# The range Type

<div class="warning">

Ranges are not yet implemented in the Flint compiler

Ranges do not work, at all, in the compiler. But they *will* work in the future.

</div>

## What is a range?

A range represents a sequence of numbers. Use it in loops to iterate over specific values.

```rs
for i, elem in 5..10:
    print($"Index {i}, Value {elem}");
```

## Output:

> ```
> Index 0, Value 5
> Index 1, Value 6
> Index 2, Value 7
> Index 3, Value 8
> Index 4, Value 9
> Index 5, Value 10
> ```

## The Unused Operator `_`

Use `_` to ignore either the index or the element:

```rs
for _, elem in 1..5:
    print($"Value {elem}"); // Ignores the index

for i, _ in 1..5:
    print($"Index {i}"); // Ignores the value
```

With these tools, you can now make decisions, repeat actions, and handle collections effectively in Flint!
