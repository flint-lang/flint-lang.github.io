# Error Set Refinement

Error set refinement is a very simple concept. You have learned in the last chapter how to create a new error set type using the `error` keyword. Now you will learn another important concept of how Flint's errors work under the hood. A set is a collection of values, both in set theory in mathematics and in Flint that's equally true. So, the error set from the last chapter, `error ErrorSet: Value1, Value2;` contains exactly two values: `Value1` and `Value2`.
We can define set-relationships in Flint. One Error set could "extend" a base error set, and becomes a more specialized error by doing so. Here is a small example of that:

```ft
error ErrBase:
	B1, B2;

error ErrSpecial(ErrBase):
	S1, S2;

def main():
	throw ErrSpecial.B1;
```

This program will print these lines to the console:

> ```
> The given error bubbled up to the main function:
>  └─ ErrSpecial.B1: ""
> ```

The error set `ErrSpecial` is an extension of the error set `ErrBase`, thus contains all values of it's base set. The error set `ErrBase` contains the values `[B1, B2]` and the error set `ErrSpecial` contains the values `[B1, B2, S1, S2]`. This is a very important concept in Flint. The more "special" an erro becomes the **bigger** does it's set become. This might seem counter-intuitive but when looked at it from the mathematical standpoint this is just how it works.

## The null-set

Mathematical sets all have a null-set, a set which contains no value and as a result is the "base" set of **every** other set. Because **every** set contains the null-set and is a superset of it. In Flint, this "null-set" for errors is represented as the type `anyerror`. The `anyerror` "set" is a true null-set meaning it does not "contain" any values. This is only true semantically, of course, as under the hood the `anyerror` is actually the same structure as any other error too. But this allows us to "cast" every error to an `anyerror`, because every error set **is** (contains) an `anyerror`. So, when we now look at this example here:

```ft
use Core.print

error ErrBase:
	B1, B2;

error ErrSpecial(ErrBase):
	S1, S2;

def crash():
	throw ErrSpecial.B1;

def main():
	crash() catch err:
		print("Error catched\n");
```

which prints this line to the console:

> ```
> Error catched
> ```

we can look at the function `crash` and look at the type of the returned error. In our case, the type of the returned error is `anyerror?`, it is `none` if there was no error. If there was an error, however, we directly unwrap it and put the error accessible into the `err` variable. So, in this above case the `err` variable is of type `anyerror`. The type `anyerror` however, like said before, is not really "nothing", it still contains the thrown error, but this error just could be _any_ error, hence the name.
Also, what was not told until now is that even the `ErrBase` extends a set, the `anyerror` null-set! So, the error definition from above actually looks more like that:

```ft
error ErrBase(anyerror):
	B1, B2;
```

But the `anyerror` set contains no values, so the `ErrBase` set still only contains the values `[B1, B2]` but now it formally extends from the error set of `anyerror` and thus is "castable" to that set. If no explicit "parent" error is defined when declaring a new error the compiler will always use the `anyerror` set as the parent set. You may be able to see that a tree structure emerges, where every error could be extended by multiple other errors but every error has exactly one specific parent, no more parents, and the `anyerror` error is the root of the tree. This tree-relation, however, has no runtime footprint, it purely exists in the type-system to be able to tell which error can be "cast" to which other error.
