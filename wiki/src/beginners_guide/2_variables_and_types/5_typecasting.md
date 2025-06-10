# Typecasting

First of all, what is typecasting? We know what a `type` is, but what is `casting`? Casting is the act of _converting_ one type into another. Different types are incompatible with one another, even `i32` and `u32` are incompatible, even though both of them have the same bit width. For example, the `i32` value of `-233235653` would actually be `4061731643` when the bits would be interpreted as an `u32` instead. And if the 32 bits of the `i32` value would be interpreted as an `f32` value, we would end up with the number `-3.032584e30`. (The bit pattern of this example is `1111 0010 0001 1001 0001 1011 0011 1011`)

As you can see, just storing the bits of one number into the bits of another number is not enough. This is the reason to why we need to convert, or **cast** types. Try to compile this program and see what the compiler tells you:

```rs
def main():
    i32 val = 3.3;
```

The compiler will throw an error like:

> ```
> Parse Error at main.ft:2:15
>  -- Type mismatch of expression 3.3;
>  -- Expected i32 but got f32
> ```

and it will tell you exactly what went wrong. The type of `i32` was expected, beause we want to store something of type `i32` in the variable `val`, but we provided a floating point number, which defaults to `f32`. So, we need to convert the type of `f32` to `i32` in this case.

## Explicit Typecasting

Types can be explicitely cast like this:

```rs
def main():
    i32 val = i32(3.3);
```

We just write the type we want to have like `i32` in this case followed by an open paren `(` and then the **expression** which has a different type and then the closing paren `)`.

Also, every type can be cast to an `str` type! Try to run this program and see what happens:

```rs
use Core.print

def main():
    f32 fval = 3.3;
    str message = "fval = ";
    message += str(fval);
    message += "\n";
    print(message);
```

You will see the message

> ```
> fval = 3.3
> ```

printed to the console.

Okay, and now a bit more complicated example:

```rs
use Core.print

def main():
    f32 fval = 3.7;
    i32 ival = i32(fval);
    str message = "fval = ";
    message += str(fval);
    message += ", ival = ";
    message += str(ival);
    message += "\n";
    print(message);
```

This small program prints this message to the console:

> ```
> fval = 3.7, ival = 3
> ```

You maybe expected a result like

> ```
> fval = 3.7, ival = 4
> ```

but here comes some very important information about type casting: When casting floating point types to integer types the fractional part is simply **cut off**. Its never rounded, only cut. But that definitely can be a good thing, if used correctly. Just remember, that when casting floating point values to integer values you will simply loose the fractional information.

## Implicit Typecasting

Everything we have discussed up until now was regarding the act of **explicitely casting** values. But, some values can be cast **implicitely** by the compiler. There exists one rule of thumb in Flint: You can cast types implicitely if you _won't_ loose any information through that cast. So, you can happily implicitely cast `i32` to `f32` but you _cannot_ implicitely cast `f32` to `i32`. Also, pretty much _any_ type can be implicitely cast to a `str` type too! Here's how this looks in action:

```rs
use Core.print

def main():
    f32 fval = 3;
    str message = "fval = ";
    message += fval;
    message += "\n";
    print(message);
```

Notice how we did not write _any_ explicit casting whatsoever? This program prints this message to the console:

> ```
> fval = 3.0
> ```

Note that the floating point to string conversion happened implicitely?

<div class="warning">

This behaves differntly in the current release of Flint

Currently, you won't see `fval = 3.0` printed to the console, but rather `fval = 3`. This is not a big deal, it only happens when the fractional part of the floating point value is zero, but this behaviour is a bit misleading, as you now could think that the value used to print `3` is an integer type, not a floating point type. Printing `3.0` makes this unambiguous and is considered the correct way to do it.

</div>
