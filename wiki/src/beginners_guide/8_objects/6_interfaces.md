# Interfaces

An [Interface](https://en.wikipedia.org/wiki/Interface_(object-oriented_programming)) is a third new type we need to discuss. It is Flins approach to support [Polymorphism](https://en.wikipedia.org/wiki/Polymorphism_(computer_science)). You already know the `func` type, which is used to create a reusable component which has **static guarantees** about what data components it requires etc. But what if we just want to describe a capability without knowing upfront what data is needed?

A good example would be a `to_string()` function coming from a `Serializable` interface. We do not know upfront which data an object may contain, but we still want to be able to call `to_string()` on that object. Lets go with this base idea and explore it a bit. First of all, we need to create our interface type itself:

```ft
interface Serializable:
	const def to_string() -> str;
```

The syntax is pretty simple here, we just write the `interface` keyword followed by the name of the interface. And then, the body of the `interface` only contains **virtual functions**. A virtual function means nothing other than that it is a function with no body. An `interface` is **only** allowed to contain virtual functions. You are not allowed to write an actual implementation for the function in an interface definition. Likewise, a `func` component is not allowed to contain any virtual functions (declarations), at all, only concrete functions (definitions).

Okay, now that we know how to crate an interface we need to *use* it:

```ft
interface Serializable:
	const def to_string() -> str;

data Data:
	i32 x;
	Data(x);

object Object implements(Serializable):
	data: Data d;
	Object(d)

	const def to_string() -> str:
		return $"\{ x: {d.x} \}";
```

We have a new clausel here, the `implements` clausel. It is pretty similar to the `requires` clausel of `func` components. We create our object and then we explicitely say which interfaces it `implements`. This is done explicitely because through the addition of polymorphism, some internal things need to be generated additionaly which were not required for non-polymorphic objects. The common case (object instances, func instances etc) is all 100% identical between objects which do and do not implement interfaces.

As you can see, we defined the `to_string` function inside our object. The `Serializable.to_string` function **needs** to be implemented *somewhere* in the object. But the `Object.to_string` function has the signature of `const Object -> str` and not `() -> str` which the `Serializable.to_string` function expects. So, how can this function be the implementation for it? Function linking (resolving the virtual function to its implementation) always happens on basis of the **explicit signature** of function, **not** on the **implicit signature** ([Implicit vs explicit signatures](./4_signatures.md#implicit-vs-explicit-signatures)).

With this knowledge, we now can look at a full practical example utilizing interfaces:

```ft
use Core.print

interface Serializable:
	const def to_string() -> str;


data Data:
	i32 x;
	Data(x);

object Object1 implements(Serializable):
	data: Data d;
	Object1(d)

	const def to_string() -> str:
		return $"\{ x: {d.x} \}";


data Data2:
	i32 y;
	Data2(y);

object Object2 implements(Serializable):
	data:
		Data d1,
		Data2 d2;
	Object2(d1, d2);

	const def to_string() -> str:
		return $"\{ x: {d1.x}, y: {d2.y} \}";


def serialize(Serializable s):
	print($"s.to_string() = {s.to_string()}\n");

def main():
	o1 := Object1(Data(10));
	o2 := Object2(Data(20), Data2(30));

	serialize(o1);
	serialize(o2);
```

This program will print these lines to the console:

> ```
> s.to_string() = { x: 10 }
> s.to_string() = { x: 20, y: 30 }
> ```

There is one thing we have not discussed yet: interface instances. The interface type `Serializable` can be used as an instance, we use it in the `serialize` function. This function does not care which object we pass to it, it only cares that the passed-to object `implements` the `Serializable` interface.

As you can see, we can pass two **different** object types to the **same** function and the behaviour **differs**. This is the essence of polymorphism.
