# Arrays

In the previous chapter we learned the importance of `data`, groups, mutli-types, tuples and how to use all of them in functions. With all these concepts we now developed a good understanding of Flint's type-system. So, its now time to move to more complex types than those of the last chapter – arrays.

## What are Arrays?

An array is a collection of the same data type which can be resized and filled with values. While mutli-types and tuples are great for storing a small amount of values, what if we want to store a hundred of them? Using a tuple to store 100 elements would not only be extremely tedious but also extremely verbose. Just imagine writing `i32, ` a hundred times inside the `data<..>` definition.

You actually already know an array type: Strings! The `str` type is just an array of characters (`i8`) but you will also learn how strings work under the hood in this chapter!

## Why are Arrays Important?

Arrays are essential in programming because the allow you to:

- Store and manipulate large amounts of data
- Perform operations on multiple values at once
- Use indexing to access specific values in the array

## What to Expect

In this chapter, we will conver the following topics:

- Declaring and using arrays
- Accessing and modifying array elements
- Using arrays in functions and data modules
- What strings and arrays have in common with one another
- What ranges are and how to use them
- The enhanced for loop, what it is and how it works
- Multi-dimensional arrays and access patterns
- Best practices for working with arrays
