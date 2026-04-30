# Callables & Variable Persistence

Welcome to the fourth chapter of the intermediates guide. In this chapter we look at callables and how they interact with the rest of Flint's type system. Callables are types that represent functions or blocks of code that can be passed around, stored, and invoked. Additionally, we'll explore variable persistence and the basics of the Thread Stack, which makes it all possible.

## What are Callables?

A callable is a function value with stored state on the Thread Stack, so it can be passed around, invoked, and keep persistent data across calls. Callables are first-class citizens in Flint, meaning they can be assigned to variables, passed as arguments to other functions, returned from functions and stored in data structures. Furthermore, Flint supports a unique approach to persistent state of callables which makes things like state machines, event systems etc trivial.

## Why are Callables Important?

Callables are an essential part of Flint because they allow you to:

- Treat functions as data, enabling functional programming patterns
- Create higher-order functions that accept or return callables
- Maintain local state across function invocations
- Build flexible abstractions like callbacks, event handlers, and transformations

## What to Expect

In this chapter, we will cover the following topics:

- Understanding callable types
- Declaring variables of the `fn` type
- Creating callables through function references
- Passing callables as function parameters
- Returning callables from functions
- Local variable persistence and mutation
- Building higher-order functions
- Performance considerations when using callables
