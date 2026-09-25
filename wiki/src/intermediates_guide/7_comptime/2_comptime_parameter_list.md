# Comptime Parameter List

<div class="warning">

The Comptime Parameter List currently **only** supports parameters of type `type`.

Once CTE (compile-time evaluation) lands this will be expanded, meaning that you will be able to pass **any** arbitrary value to a definition expecting a comptime parameter.

</div>

The comptime parameter list sits at the center of many advanced comptime features of Flint. It essentially is just a way to be able to define a list of compile-time parameters (like its name suggests) which we then can pass to definitions like types, functions etc. When defining types and functions we can optionally add the comptime parameter list after the name of the definition we just defined. Adding a CPL to a definition makes this definition **generic**. Even though the CPL and generics aren't the same thing exactly, I will use this term from now on to describe types or functions containing a CPL because it's the most industry-standard description of it. The most simple example of a **generic definition** would be a `data` definition containing a CPL:

```ft
use Core.print

data Node[type T]:
	T value;
	Node[T]? next;

def main():
	n := Node[i32]{ .value = 10, .next = Node[i32]{.value = 20} };
	print($"n.next!.value = {n.next!.value}\n");
```

This program will print this line to the console:

> ```
> n.next!.value = 20
> ```

We have quite a lot to go through here, so lets start with the generic definition itself. After the name of the defined data component `Node` we added the CPL which is written as `[...]`. Inside this CPL we can add any parameter of any type we would like, for now we only added a value of type `type`. The `type` type is, just like `int` and `float`, a compile-time only type. You have used values of this type a lot until now, for example `i32` itself, is a type. So, this means that the generic definition `Node` expects one value of type `type` to be able to be **specialized** (more on that shortly).

Inside the body of the generic definition, we can use the comptime parameters freely. Because `T` is of type `type` it can be used in every place where Flint expects a type, for example in the `T value` field. The syntax in the next line is new, as `Node[T]?` is not something we have seen yet. Just like we **define** the CPL using `[...]` we can pass values to a generic definition using the same bracket syntax `[...]`. `T` in the case of `Node[T]?` is a **compile-time value**. It's a value we get as a parameter from the CPL and we can further pass the parameter to generic definitions.

Oh, on a side note: Generic types (like the unresolved `Node`) are also compile-time only types. This means that you are not able to write a declaration like `Node n = ...;` as `Node` has not been specialized and thus is a pure comptime type.

## Specialization

When we write something like `Node[i32]` then we **specialize** the generic type `Node[type T]` with a comptime value passed to it. So lets say we specialize `Node` once with a `i32` and once with a `f32` value:

```ft
use Core.print

data Node[type T]:
	T value;
	Node[T]? next;

def main():
	n1 := Node[i32]{ .value = 10, .next = Node[i32]{.value = 20} };
	print($"n1.next!.value = {n1.next!.value}\n");

	n2 := Node[f32]{ .value = 4.23, .next = Node[f32]{.value = 72.34} };
	print($"n2.next!.value = {n2.next!.value}\n");
```

This program will print these lines to the console:

> ```
> n1.next!.value = 20
> n2.next!.value = 72.339996
> ```

As you can see, we *specialized* the generic type definition `Node` twice, once with `i32` and once with `f32`. The generic type `Node`, however, does not exist at runtime. As specialization is the act of applying a list of comptime values (CVL) to a generic definition, the result of this specialization is a "regular" (resolved) definition. So, the above example actually looks more like something like this internally:

```ft
use Core.print

data Node__i32:
	i32 value;
	Node__i32? next;

data Node__f32:
	f32 value;
	Node__f32? next;

def main():
	n1 := Node__i32{ .value = 10, .next = Node__i32{.value = 20} };
	print($"n1.next!.value = {n1.next!.value}\n");

	n2 := Node__f32{ .value = 4.23, .next = Node__f32{.value = 72.34} };
	print($"n2.next!.value = {n2.next!.value}\n");
```

Note that the names like `Node__i32` and `Node__f32` are invented, their names are different internally containing characters a regular identifier cannot contain. So, don't worry about potential name-overlaps of generic types with your types, you are unable to define a type manually with the same internal name as a specialized generic type.

At runtime, the type `Node` disappeared entirely and left over are only the "real" types produced by specializing that generic type. This process, of specializing generic definitions, is called [Monomorphization](https://en.wikipedia.org/wiki/Monomorphization). Even though this exact terminology is more commonly used to just describe the specialization of **functions**, it can also be used to describe the specialization of types.
