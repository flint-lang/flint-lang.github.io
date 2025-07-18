# Optionals

Welcome to the first chapter of the intermediates guide. In this first chapter we look at the optional type and what you can do with it. Other languages don't necessarily "need" an optional type because of other designs like Java's `null`, C's `NULL` or C++'s `nullptr`. In Flint, however, not every varaible or "object" can be "null" or "empty" implicitely.

## What are Optionals?

An optional is essentially just a struct under the hood, composed of a boolean value whether the optional has a value followed by the actual data of the optional. So an optional looks like `{ i1, T }` in memory. Optionals are crucial to be able to build up "possible" values (or possible absence of values) which is the basis of linked lists, for example, and much much more.

## Why are Optionals Important?

Optionals are an essential part of Flint because they allow you to:

- Describe the possibility of a value's absence
- Make initialization able to be "lazy"

## What to Expect

In this chapter, we will cover the following topics:

- Declaring and using optional variables
- Unwrapping and force-unwrapping of optional variables
- Comparing optional values with one another
- Providing default values through the null coalescence operator
- Switching on optional values
- Building optional chains through the optional chaining operator
