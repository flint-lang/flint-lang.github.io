# Strings

As stated earlier, strings and arrays have very much in common, actually. If we would make a deep-dive into how Flint works internally we would see that arrays and strings actually are the same data structure, but thats too low level for now. But, the important thing to note here is the similarity of strings with arrays, as a string is essentially just an array of characters, but what *is* a character in string really?

In Flint, a character has the type `u8`, a type we have not discussed until now. So, if you save the sting `hello` on a variable its essentially the same as if you would store a `u8[]` array of length `5`. There exists a separate `str` type, however, to make our life with strings a lot easier than it would if we would need to think of strings as arrays of bytes.

But what does all of this mean? Well, first we can access a given character of a string exactly as we would access any element of an array, here is an example:

```rs
use Core.print

def main():
    str name = "Marc";
    u8 third = name[2];
    print($"third = '{third}'\n");
```

This program will print this line to the console:

> ```
> third = 'r'
> ```

Now you might say...wait a minute, why is the character printed as `r` and not as a number, it's an `u8` type nonetheless, right? Yes, it is. Flint currently only supports characters from the ASCII set. In computers, characters as text is represented as numbers in the ASCII set. You can look at the whole ASCII table [here](https://www.ascii-code.com/en). According to the table, the character `r` should be the ASCII value of `114`, lets check that:

```rs
use Core.print

def main():
    str name = "Marc";
    u8 third = name[2];
    print($"third = '{third}' at idx {i32(third)}\n");
```

This program will print this line to the console:

> ```
> third = 'r' at idx 114
> ```

As you can see, `r` really is just the number `114` inside the computer. But what does this mean for arithmetic, comparisons etc? Because `u8` is "just a normal integer type" we can add, multiply, substract, divide, compare etc, everything like with `i32` values. But, we can not directly just store numbers on it without explicit typecasting. Here is an example of this:

```rs
use Core.print

def main():
    u8 character = 'C';
    print($"character '{character}' is {i32(character)}\n");

    character++;
    print($"character '{character}' is {i32(character)}\n");
```

This program will print these lines to the console:

> ```
> character 'C' is 67
> character 'D' is 68
> ```

## Getting a string's length

It is not uncommon to have a string as a paramter of a function, for example, and then we often want to get the length of the string somehow, maybe we dont know the length of a string beforehand, for example when parsing user input (will be talked about in a later chapter). But, very often we don't know the size of a string when writing the program, so we need a way to get a strings length at runtime. Here is a small program demonstrating how to get and use the length of a string:

```rs
use Core.print

def main():
    str some_string = "some neat string";
    len := some_string.length;
    print($"string '{some_string}' is {len} characters long\n");
```

This program will print this line to the console:

> ```
> string 'some neat string' is 16 characters long
> ```

The variable `len` is of type `u64` here. The `length` field of a string is **always** a `u64`. One-dimensional arrays have also the result type of `u64` for their `.length` field. Here is a small example how you can print an unknown string line by line:

```rs
use Core.print

def print_str(str input):
    for i := 0; i < input.length; i++:
        print($"{i}: '{input[i]}'\n");

def main():
    print_str("Hello");
    print_str(", ");
    print_str("World!\n");
```

This program will print these lines to the console:

> ```
> 0: 'H'
> 1: 'e'
> 2: 'l'
> 3: 'l'
> 4: 'o'
> 0: ','
> 1: ' '
> 0: 'W'
> 1: 'o'
> 2: 'r'
> 3: 'l'
> 4: 'd'
> 5: '!'
> 6: '
> '
> ```
