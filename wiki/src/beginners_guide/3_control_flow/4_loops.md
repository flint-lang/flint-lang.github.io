# Loops

Programming often involves repeating tasks. For example, imagine printing every number from `1` to `10`. It’s tedious to write print 10 times! Loops automate such repetition. But what even _is_ a loop? Lets start with the most simple form of a loop, the `while` loop.

## The `while` Loop

The while loop is actually the more simple loop you can have. The body of the loop (its scope) is executed as long as the condition of the while loop evaluates to `true`. But be cautious, you can create **infinite loops** relatively easily with a `while` loop. Here is a simple example of a while loop in action:

```rs
use Core.print

def main():
    i32 num = 0;
    while num < 5:
        print($"num = {num}\n");
        num++;
```

But wait! Whats this `num++`? The `++` is called an **increment operator** it literally just increments `num` by 1. So, `num++` is just a neat way to say `num += 1`, which is a neat way to say `num = num + 1`. The increment operator exists because its just so common to write incrementations in loops (and it looks nicer too).

The above program will print these lines to the console:

> ```
> num = 0
> num = 1
> num = 2
> num = 3
> num = 4
> ```

As you can see, the body of the while loop got executed `5` times. If you, for example, would forget the `num++` line, this while loop would turn into an infinite loop. Can you see why?

Its because the condition `num < 5` will always stay `true` because `0 < 5`. But the while loop is only one of the looping statements which exist in Flint, there are more.

## The `do while` Loop

<div class="warning">

The do while loop does not yet work in the compiler.

Do while loops do not work at the moment, as they just have not been implemented in the compiler yet. But they will work in future releases eventually.

</div>

The `do while` loop is actually very similar to the `while` loop. The expression of the `while` loop gets evaluated _before_ the body of the loop is executed. It executes the body if the condition is true, and then jumps back to the condition and checks again and so on. In `do while` loops this is different. Here, the body is executed first and _then_ the condition is checked. Similar to `while` loops, `do while` loops run as long as the condition evaluates to true. Here is a small example of a `do while` loop:

```rs
use Core.print

def main():
    i32 num = 0;
    do:
        print($"num = {num}\n");
        num++;
    while num < 5;
```

This loop will have the same output as the `while` loop above. But try changing the initial value of `num` to something bigger or equal to `5`, for example setting it to `10`. Do you recognize a difference between the two loop types?

The `do while` loop actually always executes **at least once** while the `while` loop can actually skip its body entirely. Ensuring that a loop runs at least once is not as common as the "normal" while loop, but when you need it you will be greatful that it is supported, as emulating the same behaviour with "normal" while loops is pretty hard.

## The `for` Loop

A `for` loop is very interesting, and probably the loop type you will end up writing the most common in Flint. The important part of the `for` loop is, that it is composed of three main parts:

- The variable declaration statement
- A condition (exactly how `while`'s condition works this condition is evaluated _before_ the body runs)
- A statement that will be executed at the end of each iteration

But it is best shown how this will look:

```rs
use Core.print

def main():
    for i32 i = 0; i < 5; i++:
        print($"Iteration {i}\n");
```

This program will print these lines to the console:

> ```
> Iteration 0
> Iteration 1
> Iteration 2
> Iteration 3
> Iteration 4
> ```

If you look closely, its actually pretty much the same as with our while loop. Both `for` and `while` loops are actually interchangable from one another, meaning that one loop type can easily be converted to the other type. In our case, the `while` loop implementation of this very same loop would look like this:

```rs
use Core.print

def main():
    i32 i = 0;
    while i < 5:
        print($"Iteration {i}\n");
        i++;
```

But there exists one rather big difference between `for` and `while` loops. While in the `while` loop, the variable `i` is now part of the main function's scope, for the `for` loop, this is not the case. The `i` variable is only contained _inside_ the `for` loops scope. This is very important, because it is most common to use `i` for the **i**ncrementing variable of a loop:

```rs
use Core.print

def main():
    for i32 i = 0; i < 5; i++:
        print($"Loop 1, iteration: {i}\n");
    // 'i' cannot be used after the for loop

    // 'i' can be re-declared here, because 'i' was
    // never declared inside the main functions scope
    for u32 i = 0; i < 4; i++:
        print($"Loop 2, iteration: {i}\n");
```

This program will print these lines to the console:

> ```
> Loop 1, iteration: 0
> Loop 1, iteration: 1
> Loop 1, iteration: 2
> Loop 1, iteration: 3
> Loop 1, iteration: 4
> Loop 2, iteration: 0
> Loop 2, iteration: 1
> Loop 2, iteration: 2
> Loop 2, iteration: 3
> ```

## Remember

The general rule of thumb is to use `for` loops when you know the bounds of your iteration (from number `X` to number `Y`, or `run 10 times`) and use `while` loops when the number of iterations of the loop is unknown to you. If you follow this rule of thumb you whould have very vew problems with loops.
