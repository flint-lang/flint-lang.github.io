# String Interpolation

Until now you have seen quite often that we do something like this:

```rs
use Core.print

def main():
    f32 fval = 3;
    str message = "fval = ";
    message += fval;
    message += "\n";
    print(message);
```

We create the `message` variable and then write `+=` over and over again to fill the string with values. But, there is a **much** simpler way of integrating variables into a string, its called **string interpolation**. You have already seen it once, but lets explain it now.

The syntax of string interpolation is quite simple. You write a normal string, like `"Hello Flint"`. Then you put a dollar sign in front of the string: `$"Hello, Flint"`. And thats (almost) it. Now, everything thats written in between curly braces `{}` is handled as an **expression**. Expressions are everything that you would write on the right side of the equals sign, for example. So, here an easy example:


```rs
use Core.print

def main():
    str name = "Flint";
    i32 age = 1;
    print($"Hello, my name is {name} and I am {age} years old.\n");
```

Output:

> Hello, my name is Flint and I am 1 years old.

And now you see why its important that almost any type can be implicitely cast to a `str` type, because otherwise we would need to write `str(age)` here, or need to write `str(..)` any time we would want to use string interpolation.

You can actually interpolate any variable or expression into a string:

```rs
use Core.print

def main():
    f32 pi = 3.14;
    // Inserting floating point values
    print($"The value of pi is approximately {pi}\n");
    // Inserting an arithmetic expression
    print($"2 + 2 equals {2 + 2}\n");
```

Which prints these lines to the console:

```
The value of pi is approximately 3.14
2 + 2 equals 4
```

