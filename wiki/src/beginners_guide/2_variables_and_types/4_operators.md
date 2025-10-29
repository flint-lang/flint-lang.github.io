# Operators

Flint has quite a few operators in its disposal. The most common and most simple ones, however, are `+`, `-`, `*` and `/`. The `+` and `-` operators dont need much explaination, really.

## Integer Arithmetic

Lets start with the most obvious example first: integer types and lets go through all operations one by one:

### The `+` Operator

The `+` operator is very easy, it is used to add two numbers together. But there is a catch... do you remember the [Bit-Width](./1_primitive_types.md#bit-width) table from [this](./1_primitive_types.md) chapter? This now becomes important, more specifically the **Min** and **Max** value columns. For example, if you add two `u32` typed variables together, like so:

```ft
def main():
    u32 n1 = 4_294_967_290;
    u32 n2 = 10;
    u32 n3 = n1 + n2;
```

what value should `n3` then have? Oh, and dont get confused by the `_` values in the number. Flint will ignore these and it will read the number as `4294967290` just fine, but they make the number _much_ more readable!

If you execute the built binary you will see this message printed to your console:

> ```
> u32 add overflow caught
> ```

This happens, because the maximum value of an `u32` is `4.294.967.295` and `4.294.967.290 + 10 = 4.294.967.300`, which is greater than the maximum value of the `u32` type. In any computers, the numbers are represented as binaries (`0` and `1`) and any number uses the `binary` number system. If you are interested in this topic you can search for **Integer Overflow**.

In Flint, however, the `u32` value is just capped to the maximum value of `u32`. So, `n3` will have the value `4.294.967.295` saved in it after the addition.

### The `-` Operator

The same as above applies here. The minimum value for `u32` values is `0`, so if we try to run this program:

```ft
def main():
    u32 ten = 10;
    u32 twenty = 20;
    u32 result = ten - twenty;
```

we get a similar message as before:

> ```
> u32 sub underflow caught
> ```

A `underflow` is the same as an `overflow` but for the minimum value instead of the maximum value. Just like with the overflows, Flint clamps the value at `0` here too.

### The `/` Operator

Because integer types (`i32`, `u32`, ...) don't have a fractional part like floating point types (`f32`, ...) they cannot preserve their fractional information when dividing. This means that in this function here:

```ft
def main():
    i32 n1 = 100;
    i32 n2 = 30;
    i32 n3 = n1 / n2;
```

The varaible `n3` will have the value `3` saved in it, even though the value actually would be `3,333..`. This is a characteristic of **integer division**. The fractional part is _always_ cut off. If you program a bit you will actually find out that this behaviour can work to your advantage. So, this also means that the result of `100 / 60` is `1,666..` with the fractional, but for integer divisions its just `1`.

The `*` Operator is pretty easy to understand, actually. There aren't much things to consider when using it ecept for a possible _integer overflow_ if the result becomes too large and order of operation.

Order of Operation (or better said the _wrong_ order of operation) is a very common mistake regarding integer arithmetic. It is commonly overlooked that a division can lead to a `0`, for example with the calculation of `10 / 8 * 16`, we would expect the result to be `20`. But the calculation is evaluated as follows: `(10 / 8) * 16` which expands to `10 / 8` which is `0`.

So, mathematically we would expect the result to be `20` but because of the order of operations it has become `0` instead. This can only be fixed by applying the correct oder, in our case this would be `10 * 16 / 8` which gets evaluated to `(10 * 16) / 8` which will result in the expected result of `20`.
Note that you can also use parenthesis to explicitely state the order of operation you want to have: `10 / (8 * 16)` (this will still result in `0` but its evaluated differently).

### The `==` and `!=` Operators

One can also _compare_ two integer values with one another. The comparison returns a boolean (`bool` type) which is used for comparisons, but you will learn more about what a `bool` is in the upcoming chapter [here](/wiki/src/beginners_guide/3_control_flow.md). For now, just note that the operator exists.

## Floating Point Arithmetic

Floating Point Arithmetic can be pretty tricky at times. Flint's floating points use the IEEE-754 standard. If you don't know what this means, dont worry, we will talk about it here, as easy as possible. If you want to know more about the standard and how floating point numbers are actually implemented, it is recommended to look [here](https://www.geeksforgeeks.org/ieee-standard-754-floating-point-numbers/).

But, in a nutshell, any floating point number comes with a specific level of **inprecision**. You dont need to worry about what this means for now, just remember that a number might not be **exactly** the number you specified, because some numbers (like `1 / 3`) cannot be stored in a number on the computer, because its result is `0.333...` and it cannot be stored and compared reliably. Also, some numbers just cannot be stored fully in floating point numbers. Here is a small example showing floating point arithmetic inprecision in action:

```ft
use Core.print

def main():
    f64 val = 0.3;
    val += 0.6;
    print($"0.3 + 0.6 = {val}\n");
    print($"{val} == 0.9 ? {val == 0.9}\n");
```

From this small program, you will see the output

> ```
> 0.3 + 0.6 = 0.9
>
> 0.9 == 0.9 ? false
> ```

Don't worry about that `$"{..}"` thing, its called _string interpolation_ and you will learn about it [shortly](./6_string_interpolation.md).

But, as you can see the condition is `false`, thats because `val` is not **exactly** the same as `0.35` in this case, because their bits differ. So, use the `==` and `!=` operators with caution when dealing with floating point variables.

## Strings

Strings (`str` type) do not support the `-`, `*` or `/` operators. _But_ you can use the `+` operator to add (concatenate) two strings:

```ft
use Core.print

def main():
    str hello = "Hello, ";
    str world = "World!\n";
    str hello_world = hello + world;
    print(hello_world);
```

If you run this program, you will see this output in your console:

> ```
> Hello, World!
> ```
