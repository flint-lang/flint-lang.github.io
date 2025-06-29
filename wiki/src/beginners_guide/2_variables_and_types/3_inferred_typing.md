# Inferred Typing

Flint allows for inferred typing, meaning you don't always need to explicitly state the type of a variable. The compiler can infer the type based on the assigned value.

## How it works

```rs
def main():
    x := 42; // The compiler infers that x is an i32
    pi := 3.14; // The compiler infers that pi is a f32
    greeting := "Hello, Flint!"; // The compiler infers that greeting is a str
```

While inferred typing is convenient and makes code concise, explicit typing can improve readability in more complex programs. You can always use explicit typing if you prefer its clarity:

```rs
def main():
    i32 x = 42; // Explicitly declare x as an i32
    f32 pi = 3.14; // Explicitly declare pi as a f32
    str greeting = "Hello, Flint!"; // Explicitly declare greeting as a str
```

Use inferred typing for shorter, simpler programs and explicit typing when clarity is crucial. It's also important to note that *only* varaibles are allowed to have inferred typing, nothing else.
