# Boolean Operations

## Introduction

Boolean operators, such as and, or, and not, combine or modify bool values. They’re useful for creating more complex conditions. Here’s how each works:

1. `and`
Combines two conditions and evaluates to true only if both conditions are true.
```rs
bool is_adult = true;
bool has_id = false;

if (is_adult and has_id): // Both must be true
    print("You can enter.");
else:
    print("Access denied."); // Output: Access denied.
```
2. `or`
Combines two conditions and evaluates to true if at least one condition is true.
```rs
bool is_vip = true;
bool has_ticket = false;

if (is_vip or has_ticket): // Only one must be true
    print("You can enter."); // Output: You can enter.
```
3. `not`
Reverses the value of a bool.
```rs
bool is_raining = false;

if (not is_raining): // Turns false into true
    print("You don’t need an umbrella!"); // Output: You don’t need an umbrella!
```

## Operator Precedence

`and` has a higher precedence than `or`, similar to how * has a higher precedence than + in arithmetic. Use parentheses to clarify expressions:

```rs
bool condition = true or false and false; // Evaluates to true (and happens first)
bool clarified = (true or false) and false; // Evaluates to false
