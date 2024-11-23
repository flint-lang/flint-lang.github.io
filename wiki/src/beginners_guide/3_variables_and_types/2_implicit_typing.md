# Implicit Typing

Flint allows for implicit typing, meaning you don't always need to explicitly state the type of a variable. The compiler can infer the type based on the assigned value.

**Here’s how it works:**

```rs
x := 42; // The compiler infers that x is an int
pi := 3.14; // The compiler infers that pi is a flint
greeting := "Hello, Flint!"; // The compiler infers that greeting is a str
```

While implicit typing is convenient and makes code concise, explicit typing can improve readability in more complex programs. You can always use explicit typing if you want clarity:

```rs
int x = 42; // Explicitly declare x as an int
flint pi = 3.14; // Explicitly declare pi as a flint
str greeting = "Hello, Flint!"; // Explicitly declare greeting as a str
```

Use implicit typing for shorter, simpler programs and explicit typing when clarity is crucial.
