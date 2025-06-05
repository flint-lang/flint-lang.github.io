# The `bool` Type

In Flint, the `bool` type represents truth values: `true` or `false`. Boolean values are fundamental in programming, as they enable decision-making and control flow. Boolean values are equal both in programming and in mathematics, they actually dont really differ. Here is a small example of how to declare a boolean variable and how to print its value to the console:

```rs
use Core.print

def main():
    bool is_learning = true;
    bool is_hungry = false;
    print($"is_learing = {is_learning}, is_hungry = {is_hungry}\n");
```

This program prints this line to the console:

> is_learing = true, is_hungry = false

## Checking for equality and inequality

You can check if a boolean type is equal to another boolean type. The result of the `==` and `!=` operators is _always_ a `bool` type, because either they are equal or not. So, if you look if two `i32` values are equal, the result of this check will be of type `bool`.

```rs
use Core.print

def main():
    i32 val1 = 4;
    i32 val2 = 6;
    bool is_eq = val1 == val2;
    bool is_neq = val1 != val2;
    print($"val1 = {val1}, val2 = {val2}, is_eq = {is_eq}, is_neq = {is_neq}\n");
```

This program prints this line to the console:

> val1 = 4, val2 = 6, is_eq = false, is_neq = true

But now lets compare two boolean values with one another:

```rs
use Core.print

def main():
    bool t_eq_f = true == false;
    print($"t_eq_f = {t_eq_f}\n");

    bool t_neq_f = true != false;
    print($"t_neq_f = {t_neq_f}\n");

    bool t_eq_t = true == true;
    print($"t_eq_t = {t_eq_t}\n");
    bool t_neq_t = true != true;
    print($"t_neq_t = {t_neq_t}\n");

    bool f_eq_f = false == false;
    print($"f_eq_f = {f_eq_f}\n");
    bool f_neq_f = false != false;
    print($"f_neq_f = {f_neq_f}\n");
```

This program prints these lines to the console:

```
t_eq_f = false
t_neq_f = true
t_eq_t = true
t_neq_t = false
f_eq_f = true
f_neq_f = false
```
