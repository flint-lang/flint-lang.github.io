# Introduction

In Flint, we need to explicitely define which values possibly have no value. There is no implicit nullability like in other languages, nullability is very explicit in Flint, and that's a good thing. This means that we do not check everywhere if our object maybe is null, because when it's not an optional type it is **required** to be initialized, as there *is no uninitialized state in Flint*.

We do this through the optional type. Optional values can either have a value or they can be "empty". This "empty" state is achieved through the `none` literal. If an optional variable is set to `none` it effectively has no longer any value stored on it. But let's look at optionals in an example, they are best understood through examples:

```rs
def main():
    i32? maybe = none;
```

This program will not print anything to the console, but we can see quite some things already. As you can see, an optional type is defined directly inline by just slapping a question mark at the end of the type. This makes the whole type optional, which means it now can be "nothing". You can see this through us assigning `none` to the `maybe` variable.

Let's discuss what actually happens here under the hood within the compiler and within Flint itself. You already know what a `struct` is in other languages, and in Flint thats either an anonymous tuple or `data`. So, an optional is essentially nothing else than a small struct containing of a `bool` value together with the *actual* value of the optional. In the case of our optional, this means that `maybe` is essentially the same as if we would write:

```rs
def main():
    data<bool, i32> maybe = (false, 0);
```

A boolean `false` is simply `0` in memory, as you already know. The `none` literal literally just stores zeroes on the entire optional structure. It's a `zeroinitializer` if you know this from C, its a `{0}`. Because the flag is 0 when false we can set all values to zeroes through the `none` type. This means that the `value` field of the optional structure will also be set to zeroes when storing a `none` literal on it. But here, when using the tuple, we need to specify the `value` we want to store in it, even if we want to store `none` (`(false, 0)`) on it.

Because we store all-zeroes on the optional when storing `none` on it, you now may be able to see that accessing the value of an optional when there is nothing stored in it can be considered as an error, as it's all just zeroes. But how do we even access the value of an optional variable in the first place? You will learn this in the next chapter!
