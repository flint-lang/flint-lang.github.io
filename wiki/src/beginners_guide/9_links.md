# Links

Links will be your first contact with the polymorphic concepts of DCMP. They are needed for compile-time redirection of entity-calls and runtime redirection of interface-calls and are a central piece to make DCMP ergonomic and powerful. Links are not magic, nor are they particularly complex, they are just a way to tell the compiler "this function call should resolve to a different function at compile-time or runtime".

## What are Links?

In previous chapters, you learned about `func` modules and how they can be used as interfaces. You also learned that functions of different `func` modules can be "linked" and redirected. In this chapter, you will finally learn what that means and how to use links effectively.

A **link** is an association between two functions that tells the compiler to redirect a call from one function to another. When you call a function on an interface, the actual function that gets executed depends on the function the "called" function is linked to in the entity type "stored" in this interface instance.

Consider a scenario where you have different entities with different `func` modules, but they all implement functions with the same signature. Links allow you to call these functions polymorphically through a shared interface, and the correct implementation will be called based on what entity the interface holds.

## Why are Links important?

Links are what make DCMP truly powerful and ergonomic. Without them, you would need to write different functions for each entity type, even if they perform the same logical operation. With links, you can write generic code that works with multiple entity types as long as they share the necessary `func` modules.

This is fundamentally different from OOP inheritance, where a base class defines the interface and subclasses override methods. In DCMP, there is no inheritance chain. Instead, entities are checked at compile-time to ensure they have the required `func` modules. At runtime, the interface instance carries an entity reference, and the entity determines which linked implementation gets dispatched.

## What to Expect

In this chapter, we will cover the following topics:

- virtual functions
- pure interfaces
- function linking
- polymorphic interface calls

By the end of this chapter, you will have a solid understanding of links in Flint, and you will be able to use them to write more expressive and ergonomic compositional trees. Lets jump right into it!
