# Enums

What is an enum? An enum essentially is just a number under the hood, but one with very interesting properties. It can be thought of as a **tag** which can only have one of a selected number of tags. Here is an example:

```rs
use Core.print

enum MyEnum:
    TAG1, TAG2, TAG3;

def main():
    MyEnum my_enum = MyEnum.TAG1;

    if my_enum == MyEnum.TAG1:
        print("is TAG1\n");
    else if my_enum == MyEnum.TAG2:
        print("is TAG2\n");
    else if my_enum == MyEnum.TAG3:
        print("is TAG3\n");
    else:
        print("This code path is actually impossible to reach, no matter which value 'my_enum' has!\n");
```

This program will print this line to the console:

> is TAG1

As you can see, defining our own `enum` is very simple. We write the `enum` keyword followed by the name of the enum, similar how we define the name of data. As you can see, the name `MyEnum` is now a new user-defined type, which is the reason why a variable (`my_enum`) can be declared to be of type `MyEnum`. Then, we write a colon `:` to signify the "body" of the enum, where we define all the values the enum could have. And then, we define the tag names the enum could have. Each tag name has to be unique within the same enum, so we would not be allowed to define `TAG1` twice. Tags are comma-separated and Flint sees everything as a tag until it finds a semicolon `;`.

If you dont like the horizontal layout, you can also define an enum like so:

```rs
enum MyEnum:
    TAG1, // Some description of TAG1
    TAG2, // Some description of TAG2
    TAG3; // Some description of TAG3
```

## Comparing Enums

Enums are considered equal if their type *and* their tag match. Here is an example of what this means:

```rs
use Core.print

enum Enum1:
    TAG1, TAG2, TAG3;

enum Enum2:
    TAG1, TAG2, TAG3;

def main():
    Enum1 e1 = Enum1.TAG1;

    if e1 == Enum2.TAG1:
        print("is Enum2.TAG1!\n");
```

This program will print this error to the console:

```
Parse Error at main.ft:12:8
 -- Type mismatch of expression e1 == Enum2.TAG1
 -- Expected Enum1 but got Enum2
```

<div class="warning">

The error message differs in the current version of the compiler.

The above error message is the message that *should* be displayed. But in its current form the compiler will produce this error message instead:

```
Parse Error at main.ft:1:1
 -- Type mismatch of expression EOF
 -- Expected Enum1 but got Enum2
```

There is no information contained *where* the mismatch happened or *what* the expression the error happened in was. This will be fixed eventually, but requires some changes in unrelated areas of the compiler, so it might take a while for it to be fixed.

</div>

## Enums with functions

Enums are considered to be non-complex data types in Flint, even though they are user-defined. So, we can easily pass in enums to a function and return them from it:

```rs
use Core.print

enum ComparisonResult:
    BIGGER, SMALLER, EQUAL;

def compare(i32 x, i32 y) -> ComparisonResult:
    if x > y:
        return ComparisonResult.BIGGER;
    else if y < x:
        return ComparisonResult.SMALLER;
    else:
        return ComparisonResult.EQUAL;

def main():
    ComparisonResult result = compare(10, 5);
    if result == ComparisonResult.BIGGER:
        print("is bigger\n");
    else if result == ComparisonResult.SMALLER:
        print("is smaller\n");
    else if result == ComparisonResult.EQUAL:
        print("is equal\n");
    else:
        print("Impossible to reach code block\n");
```

This program will print this line to the console:

> is bigger

The above program is very useless, though, as it would be much more efficient to remove the enum entirely and just use the comparisons directly. But these examples are not always meant to be absolutely useful, they are there to get a point across. So, we can not only return enums from a function but also pass them to a function. Lets dive into a bit bigger example now.

```rs
use Core.print

enum Operation:
    PLUS, MINUS, MULT, DIV;

data NumberContainer:
    i32 a;
    f32 b;
    u64 c;
    NumberContainer(a, b, c);

def apply_operation(mut NumberContainer container, Operation op, f32 value):
    if op == Operation.PLUS:
        container.(a, b, c) += (i32(value), value, u64(value));
    else if op == Operation.MINUS:
        container.(a, b, c) -= (i32(value), value, u64(value));
    else if op == Operation.MULT:
        container.(a, b, c) *= (i32(value), value, u64(value));
    else if op == Operation.DIV:
        container.(a, b, c) /= (i32(value), value, u64(value));

def main():
    NumberContainer container = NumberContainer(-10, 22.5, u64(889));
    print($"container.(a, b, c) = ({container.a}, {container.b}, {container.c})\n");

    apply_operation(container, Operation.PLUS, 3.4);
    print($"container.(a, b, c) = ({container.a}, {container.b}, {container.c})\n");

    apply_operation(container, Operation.MULT, 7.2);
    print($"container.(a, b, c) = ({container.a}, {container.b}, {container.c})\n");

    apply_operation(container, Operation.MINUS, 22.1);
    print($"container.(a, b, c) = ({container.a}, {container.b}, {container.c})\n");

    apply_operation(container, Operation.DIV, 6.9);
    print($"container.(a, b, c) = ({container.a}, {container.b}, {container.c})\n");
```

This program will print these lines to the console:

```
container.(a, b, c) = (-10, 22.5, 889)
container.(a, b, c) = (-7, 25.9, 892)
container.(a, b, c) = (-49, 186.479996, 6244)
container.(a, b, c) = (-71, 164.37999, 6222)
container.(a, b, c) = (-11, 23.823187, 1037)
```
