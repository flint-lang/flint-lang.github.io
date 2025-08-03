# Error Sets

Welcome to the third chapter of the intermediates guide. In this chapter we look at the error set type and what you can do with it. The `error` type is used to define error sets which we can use in Flint's error handling system through the `throw` and `catch` keywords respectively. 

## What are Error Sets?

Errors sets are collections of possible throwable error values. Error sets are sets in the mathematical sense in the aspect of superset / subset relationships.

## Why are Error Sets Important?

Errors are an integral part of programming because sometimes things dont work as expected, but through errors we can "expect the unexpected" and handle cases in which our program would fail otherwise. So, using errors we can:

- Describe the possibility that something fails
- Describe what to do in the event of such a failure
- Continue execution after a failure safely

## What to Expect

In this chapter, we will ocver the following topics:

- Declaring and using error set types
- How to throw and catch errors
- The concept of error set refinement through superset relationships through the `anyerror` nullset
- Specifying possible error sets in the signatures of functions
- Switching on error set variants
- Switching on error sets
- Adding context to thrown errors
- Throwing anonymous errors
- Internals of the error set system
- Best practices when using error sets
- Error Switch Inlining
- Linearization
