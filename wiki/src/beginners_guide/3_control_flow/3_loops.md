# Loops: Why Repetition Matters

## Why Loops?

Programming often involves repeating tasks. For example, imagine printing every number from 1 to 10—it’s tedious to write print 10 times! Loops automate such repetition.

## The for Loop

A for loop repeats a block of code for a specific number of iterations.
Here’s the syntax:

```rs
for i := 0; i < 10; i++:
    print($"Iteration {i}");
```

Here’s what happens:

1. `i := 0;` initializes i to 0.
2. `i < 10` checks if the condition is true. If not, the loop ends.
3. `i++` increments i by 1 after each iteration.
