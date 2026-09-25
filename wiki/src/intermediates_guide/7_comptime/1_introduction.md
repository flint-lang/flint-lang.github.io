# Introduction

As stated, compile-time describes the time the *compiler* is active. After the compiler finished, you are left with an executable, which you can execute. As you know, execution-time is described as **run-time** (runtime). So, the time the compiler still is actively working on your code you have written is called **compile-time** (comptime).

Some values only exist **while compiling** and "vanish" at runtime. A good example of this would be literals in general, like numbers, strings etc. They can be modified freely while the compiler is still executing, but at runtime they are either inlined directly (number literals) or stored in a readonly location of the program (strings) meaning that they can not be modified at runtime any more.

## Compile-time types

A compile-time type is a type which is only present during compile-time but not at runtime. A **comptime value** therefore is a value which has a compile-time type. You have already used such values and types a lot already!

The `int` and `float` types are pure compile-time types. This is because they are **arbitrary precision values**. They do not have a fixed size, instead an `int` is literally just a list of digits stored in memory. So the literal `123_456_789` for example is stored as a list of digits rather than one single number in a fixed-width container, like an `u32` for example. For an integer (or floating point) literal to be usable, it needs to have a *known runtime type*, like `u32` or `f32` and then the compiler *converts* the literal to that type. This is the reason why literals can be larger or smaller than their respective maximum or minimum values of their target types. Try storing `-300` or `300` on a value of type `u8` or `i8` and you will be able to see the compile errors this produces.
