# Virtual Functions

Virtual functions are just func-module functions without a body, they are just declarations of functions inside a func-module:

```ft
use Core.print

func IMove:
	def move();

def main():
	print("Hello, World!\n");
```

This program will print this line to the console:

> ```
> Hello, World!
> ```

As you can see, the compiler will compile this program just fine. But, it is not possible to call a "virtual" function directly, this will result in a compile error:

```ft
use Core.print

func IMove:
	def move();

def main():
	print("Hello, World!\n");
	IMove.move();
```

This program will result in this compile error:

> ```
> Parse Error at main.ft:8:5
> └─┬┤E0000│
> 6 │ def main():
> 8 │ »   IMove.move();
> ┌─┴─────┘
> └─ Direct call of virtual function is not allowed
> ```

Because the virtual function does not have an body, it is not allowed to call it directly. But what wee *can* do, is call that virtual function on an interface instance of that func type:

```ft
use Core.print

func IMove:
	def move();

def apply(mut IMove m):
	m.move();

def main():
	print("Hello, World!\n");
```

This program will print this line to the console:

> ```
> Hello, World!
> ```

This works because the virtual function `function` *needs* to be linked to a "real" function at the entity-composition phase when creating new entity types. We cannot call the `apply` function yet, because without an entity type, there is no way to create an interface instance.
