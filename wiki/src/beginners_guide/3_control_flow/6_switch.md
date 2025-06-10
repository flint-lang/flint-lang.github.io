# Switch

<div class="warning">

Switch statements and expressions do not work yet.

Switch statements are not yet implemented in the compiler, at all. You will get compile errors front and center if you try to use them.

</div>

## Switch Statements

Switch statements are actually pretty easy to understand once you grasped if chains. `switch` statements are primarily used for pattern-matching purposes or for cases where you have a limited selection of possible values, like with enums, where you only have the possibilities of each tag.

Let's actually re-write the same example from the previous example, but without the if chain we now use a switch statement:

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
    switch result:
        ComparisonResult.BIGGER:
            print("is bigger\n");
        ComparisonResult.SMALLER:
            print("is smaller\n");
        ComparisonResult.EQUAL:
            print("is equal\n");
```

This program will print this line to the console:

> ```
> is bigger
> ```

If you know switch statements from other languages you may wonder "where are the `case` and the `break` keywords?". Flint does not have such keywords, at least in this context (`break` still exists for loops, just like `continue`). In most languages like C, switch statements undergo a default **fallthrough** and you must manually **opt out** of the fallthrough behaviour, which is extremely error prone. But if you dont know what **fallthrough** is, lets discuss this first.

## Fallthrough

Fallthrough is the act of executing multiple switch branches after another. We best look at this example from C:

```c
#include <stdio.h>

typedef enum { VAL1, VAL2, VAL3 } MyEnum;

int main() {
    MyEnum e = VAL1; // In C you dont need to write MyEnum.VAL1
    switch (e) {
        case VAL1:
            printf("is val1\n");
        case VAL2:
            printf("is val2\n");
        case VAL3:
            printf("is val3\n");
    }
}
```

This program will print these lines to the console:

> ```
> is val1
> is val2
> is val3
> ```

And now you might think...what? Why does this happen? This is **fallthrough** in action. The first case that got matched is actually the `case VAL1` line. Falltrough means that "the execution falls through (to the next branch)". So, after the `case VAL1` branch, the `case VAL2` branch got executed and the `case VAL3` branch afterwards. If we want the intuitively expected behaviour, where each branch is executed with no fallthrough, we would need to add the `break` keyword to _every_ single branch:

```c
#include <stdio.h>

typedef enum { VAL1, VAL2, VAL3 } MyEnum;

int main() {
    MyEnum e = VAL1; // In C you dont need to write MyEnum.VAL1
    switch (e) {
        case VAL1:
            printf("is val1\n");
            break;
        case VAL2:
            printf("is val2\n");
            break;
        case VAL3:
            printf("is val3\n");
            break;
    }
}
```

This program will print this line to the console:

> ```
> is val1
> ```

And this is the behaviour that Flint has by default. In Flint, falltrough is not opt-out but rather opt-in. We don't actually have a keyword for this but rather an annotation. Here is an example of it:

```rs
use Core.print

enum MyEnum:
    VAL1, VAL2, VAL3;

def main():
    MyEnum e = MyEnum.VAL1;
    switch e:
        #fallthrough
        MyEnum.VAL1:
            print("is val1\n");
        MyEnum.VAL2:
            print("is val2\n");
        MyEnum.VAL3:
            print("is val3\n");
```

This program will print these lines to the console:

> ```
> is val1
> is val2
> ```

It actually is not clear yet if there will exist an explicit keyword for the fallthrough. We did not want to use the `continue` keyword for this purpose, because what happens if you have a switch statement within a for loop, would the for loop continue or would the switch branch fall through? Flint tries to avoid ambiguity at all cost at all places, so we are pretty careful with its design.

## Switch Expressions

A switch, however, can not only exist as a statement but as an expression too. Instead of executing an arbitrary block of code, each switch branch needs to be an explicit expression now, marked with the arrow `->` syntax. Have a look:

```rs
use Core.print

enum MyEnum:
    VAL1, VAL2, VAL3;

def main():
    MyEnum e = MyEnum.VAL1;
    i32 result = switch e:
        MyEnum.VAL1 -> 1;
        MyEnum.VAL2 -> 2;
        MyEnum.VAL3 -> 4;
    print("result = {result}\n");
```

This program will print this line to the console:

> ```
> result = 1
> ```

For switch expressions, there does not exist such thing as a fallthrough, because there are no code blocks executed but only single expressions. Yes, a literal like `1` is an expression too, but you could write function calls or even another nested switch expression on the place of that literal.
