# Boolean Operations

Boolean operators, such as `and`, `or` and `not` combine or modify `bool` values. They’re useful for creating more complex conditions. In this chapter, you will learn how each operator works.

## `and` Operator

The `and` operator combines two conditions and evaluates to `true` only if **both** conditions are `true`.

```ft
use Core.print

def main():
    bool is_adult = true;
    bool has_id = false;
    print($"Is adult and has an ID? {is_adult and has_id}\n");
```

This program will print this line to the console:

> ```
> Is adult and has an ID? false
> ```

## `or` Operator

The `or` operator combines two conditions and evaluates to `true` if **at least** one condition is `true`.

```ft
use Core.print

def main():
    bool is_vip = true;
    bool has_ticket = false;
    print($"Is VIP or has a ticket? {is_vip or has_ticket}\n");
```

This program will print this line to the console:

> ```
> Is VIP or has a ticket? true
> ```

## `not` Operator

The `not` operator inverts the value of a boolean, so it makes `false` to `true` and vice versa.

```ft
use Core.print

def main():
    bool is_raining = false;
    print($"Is it not raining? {not is_raining}\n");
```

This program will print this line to the console:

> ```
> Is it not raining? true
> ```

## Operator Precedence

The precedence (default order of execution) of `and` is higher than the one of `or`, similar to how `*` has a higher precedence than `+` in arithmetics. This means that the `and` operation will always be evaluated _before_ the `or` operation:

```ft
use Core.print

def main():
    // Evaluates to 'true' ('and' happens first)
    bool condition = true or false and false;
    print($"condition = {condition}\n");

    // Evaluates to 'false' ('and' happens second)
    bool clarified = (true or false) and false;
    print($"clarified = {clarified}\n");
```

This program prints these lines to the console:

> ```
> condition = true
> clarified = false
> ```
