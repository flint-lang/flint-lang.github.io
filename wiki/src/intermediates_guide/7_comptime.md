# Comptime

Welcome to the seventh chapter of the intermediates guide. In this chapter we look at the compile-time capabilities of Flint and what they all enable in Flint. Compile-time features are very important to Flint as they enable generic types, functions, the ability to execute any code at compile-time, type constraints and func-erasure through predicates, type reflection and more.

## What is comptime?

Comptime is the short form of compile-time and it describes the "time" at which the Flint compiler is currently still actively transforming Flint code into machine code or other intermediate representations. The more you do at compile-time the less you need to do at runtime, making built executables faster than those built off languages which do not contain any compile-time features.

## Why is comptime important?

Comptime is an essential part of Flint because it enables us to

- evaluate any code at compile-time, moving calculations and precious time from runtime to comptime
- define generic types and functions
- specialize the actual body of functions with compile-time conditions
- perform bidirectional type reflection
- define and evaluate compile-time predicates
- erase func components in object definitions on failing func predicates (func-erasure)

## What to expect

In this chapter, we will cover the following topics:

- Understanding the Comptime Parameter List as the basis
- Applying the CPL to create generic types and functions
- Understanding how compile-time evaluation works and how to use it
- Learn the ability to reflect types
- Learn how to define and use comptime predicates
- Using comptime predicates effectively to enable patterns like func-erasure
