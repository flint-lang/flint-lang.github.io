# Branching

Branching is the act of executing different "blocks" of code depending on conditions (booleans). But, before we can talk about branching we need to talk about what this _block_ really is. Take the main function, for example:

```rs
use Core.print

def main():
    f32 val = 3.3;
    i32 val_i = i32(val);
    print($"{val} = {val_i}\n");
```

In this function, everything thats indented once is considered to be "inside" the main function. But what does this "inside" really mean? There exists a formal description for this "inside", it's called a `Scope`. The Scope of the main function is everything thats written down within the main functions _body_ ("inside" the function).

Scopes are a really important concept in programming, because there exist several consistent and deterministic rules about scopes and _subscopes_. But thats enough theory for now, lets look at the easiest example for branching, the `if` statement.

## The if Statement

The if statement lets your program execute code only when a condition evaluates to true. Here's how it works:

```rs
use Core.print

def main():
    i32 age = 18;

    if age >= 18: // The condition evaluates to true
        print($"You are {age} years old, so you can vote!\n");
```

This program will print this line to the console:

> ```
> You are 18 years old, so you can vote!
> ```

Try changing the `age` to `17` and watch what happens.

If the condition evaluates to false, the program skips the block of code inside the `if` statement. We say that the `print` call here is **inside the if statement's scope**. But what does scope really mean? Have a look at this example:

```rs
use Core.print

def main():
    i32 age = 18;

    if age >= 18:
        i32 somevalue = 22;
        print("Age is above or equal to 18!\n");

    print($"somevalue = {somevalue}\n");
```

Here, the declaration of the `age` variable is inside the `main` function's scope, while the `somevalue` declaration and the first `print` call are inside the `if` statement's scope. The second `print` call, however, is inside the `main` function's scope again. As you can see, the scope is direclty determined by the level of indentation.

If yout try to compile this program you will see a compilation error:

> ```
> Parse Error at main.ft:10:26
> └──┬┤E0000│
> 3  │ def main():
> 10 │ »   print($"somevalue = {somevalue}\n");
> ┌──┴──────────────────────────┘
> └─ Use of undeclared variable 'somevalue'
> ```

But why is that? We did define the variable `somevalue` in the if statement's scope, right? Yes, we defined the variable in the if statement's scope, but here comes one of the mentioned rules of scopes into play: Visibility.

But what's visibility? Visibility describes the visibility of variables within scopes and their parent or child scopes. The if statement's scope, for example, is a `child scope` of the `main` function's scope. Because its a child scope it can "see" all variables of its parent scope. **But** it can only see variables that have been defined up until the child scope. To illustrate what this means, look at this example:

```rs
use Core.print

def main():
    i32 val1 = 1;
    if val1 < 10:
        print("val1 < 10\n");
    i32 val2 = 2;
```

what i described above means nothing else than the simple fact that `val1` is **visible** inside the if statements scope, but `val2` is _not_, because `val2` is defined **after** the if statements scope. So, a child scope can only see variables of its parent scope that have been declared **before** it.

Parent scopes **do not** inherit **any** variable definitions of their child scopes. This program, for example:

```rs
use Core.print

def main():
    i32 val1 = 2;
    if val1 < 10:
        i32 val2 = 44;
        print($"val1 = {val1}, val2 = {val2}\n");
    i32 val2 = 12;
    print($"val1 = {val1}, val2 = {val2}\n");
```

will compile and run fine. But lets discuss why that is. The variable `val2` is defined _inside_ the if statements scope, this means that its visible for the rest of the if statements scope and all possible child scopes of it, but it is not visible for its parent scope. Because the variable `val2` does not exist in the main function's scope yet, this works fine, as no variable definition is shadowed. Because the variable `val2` never existed in the main function's scope, we can declare a new variable `val2` inside the main function.

This behaviour of visibility given down to children but never up to parents is the very reason why the compile error from above happened, becaue the variable `somevalue` was never defined in the main functions scope, so it simply does not exist at the position we wanted to use it.

## The else Keyword

Now that you know scopes and visibility, the else statement should actually be pretty easy to understand. An else statement is used whenever you want to do something if another condition failed. It is explained best through an example:

```rs
use Core.print

def main():
    i32 age = 16;

    if age >= 18: // If this is false...
        print($"You are {age} years old, so you can vote!\n");
    else: // ...then this block executes
        print($"You are {age} years old, so you cannot vote.\n");
```

This program will print this line to the console:

> ```
> You are 16 years old, so you cannot vote.
> ```

Try changing the `age` variable to, lets say 20, and see what happens.

## The else if Keyword

Sometimes, you need multiple conditions. Instead of stacking multiple if statements, you can use else if to create a chain of conditions. The important thing to remember here is that **only one** of the branches will be executed, not multiple ones.

```rs
use Core.print

def main():
    i32 age = 16;

    if age >= 65:
        print("You qualify for senior discounts.\n");
    else if age >= 18:
        print("You can vote but no senior discounts yet!\n");
    else:
        print("You are too young to vote.\n");
```

This program will print this line to the console:

> ```
> You are too young to vote.
> ```

Play around a bit. Change the value of `age` and see what happens. Try to write your own conditions and branches.
