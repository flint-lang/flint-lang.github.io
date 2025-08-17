# Null Coalescing Operator

The Null Coalescing Operator `??` is a pretty interesting operator in the sense that it "removes" the need for the optional unwrapping operator (in certain scenarios). It is used to provide a "default" value of an optional for the case that the optional is empty. It is a binary operator, like arithmetic operators, but has a very distinct purpose. It is called like that for historical reasons as it is called like that in every other language that has it, alltough we should rather call it the `Optional Coalescing Operator` in Flint, but that's besids the point.

If we take a varaible `x` and it is of type `i32?`, then a binary operator expression using the `??` operator would return a value of type `i32`. But let's look at an example maybe, then everything should be more clear:

```ft
use Core.print

def main():
    i32? maybe = none;

    i32 x = maybe ?? 0;
    print($"x = {x}\n");

    maybe = 69;
    x = maybe ?? 0;
    print($"x = {x}\n");
```

This program will print this line to the console:

> ```
> x = 0
> x = 69
> ```

But why? And how does this even work? The null coalescing operator operates on an optional-typed value as it's `lhs` which is of type `T?`, where `T` stands as a "placeholder" type, you can put any type you want in there. If the `lhs` of the `??` operator is of type `T?` then the `rhs` of the operator **must be** of type `T` and the result of the null coalescing expression will **always** be of type `T`.

In our case this means that the `lhs` has the type `i32?` and the `rhs` has the type `i32` and the result of the coalescing operation is of type `i32` as well. The operator essentailly just does these things:

- Does the `lhs` have a value?
- If yes, take that value and unwrap it
- Else, take the provided default-value from the `rhs`

So, it is simply impossible to get an hard crash with the null coalescing operator, unlike the unwrap operator which crashes when the optional is empty. But, it is not possible to provide default values in all cases. The null coalescing operator will become extremely important in the area of `linearization` in a much later chapter when we come around to `Blueprints` but it's still a long journey until then.
