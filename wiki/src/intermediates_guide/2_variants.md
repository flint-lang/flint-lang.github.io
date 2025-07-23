# Variants

Welcome to the second chapter of the intermediates guide. In this chapter we look at the variant type and what you can do with it. The `variant` type is used to define a type that could be **one of** a given collection of other types. Where optionalls allowed us to define **emptiness**, the `variant` type allows us to define *variation* in types.

## What are Variants?

A variant is, once again, essentially just a struct under the hood. It is composed of a 1 Byte flag value to determine which type it holds followed by the actual type of the variant. This "type" as the second value is just **N** bytes of storage, where `N` is the number of bytes needed to store the **biggest** of all possible types.

## Why are Variants Important?

Variants are an essential part of Flint because they allow you to:

- Describe the possibility that a value might be one of a given kind
- Store multiple different "data" in a very small space, as the variant does not occupy space for *each* value it could be

## What to Expect

In this chapter, we will cover the following topics:

- Declaring and using variant types
- Tagging variants
- Variant Comparison
- Force-unwrapping a variant variable
- Switching on variant values
- Building optional chains through the variant extraction operator
- Making variants optional and how variants interact with optionals
