# The `bool` Type and Conditional Statements

## Introduction to bool

In Flint, the bool type represents truth values: true or false. Boolean values are fundamental in programming, as they enable decision-making and control flow. For example:

```rs
bool is_learning = true;
bool is_hungry = false;
```

Here, isLearning is set to true, meaning it’s "on," while isHungry is false, meaning it’s "off."

## Checking for equality and inequality

With floating points, errors tend to add up over time, especially when dealing with very small incremental changes in numbers. To check if a number is equal to another floating point number could be wrong, because a number might be *slightly* less or *slightly* more. For example, when doing `var == 0.3` the variable `var` could have the value `0.2999999` saved in it, but the comparison would still fail, as `var` is *not* `0.3`.

This is the very reason why the `==` operator

## The if Statement

The if statement lets your program execute code only when a condition evaluates to true. Here's how it works:

```rs
int age = 18;

if (age >= 18): // The condition evaluates to true
    print($"You are {age} years old, so you can vote!");
```

If the condition evaluates to false, the program skips the block of code inside the if.

**Indentation Reminder**: Remember to use hard tabs for indentation! Without proper indentation, Flint won't understand which code belongs to the if block.

## The else Keyword

What if you want to handle both possibilities? That’s where else comes in:

```rs
int age = 16;

if (age >= 18): // If this is false...
    print($"You are {age} years old, so you can vote!");
else: // ...then this block executes
    print($"You are {age} years old, so you cannot vote.");
```

The else block runs only when the if condition is false.

## The else if Keyword

Sometimes, you need multiple conditions. Instead of stacking multiple if statements, you can use else if to create a chain:

```rs
int age = 16;

if (age >= 65):
    print("You qualify for senior discounts.");
else if (age >= 18):
    print("You can vote but no senior discounts yet!");
else:
    print("You are too young to vote.");
```
