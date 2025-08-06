# List Example

Now that we have optionals at our disposal and we know that optionals are references to actual values, we can build our first liked list in Flint! If you want to learn more about what a linked list actually is, i recommend you to look [here](https://www.w3schools.com/dsa/dsa_theory_linkedlists.php). Let's look at how a linked list looks in Flint:

```rs
use Core.print

data IntList:
	i32 value;
	IntList? next;
	IntList(value, next);

def append(mut IntList list, i32 value):
	if list.next == none:
		list.next = IntList(value, none);
	else:
		append(list.next!, value);

def print_list(IntList list):
	print($"{list.value}");
	if list.next != none:
		print(" -> ");
		print_list(list.next!);
	else:
		print("\n");

def main():
	IntList list = IntList(10, none);
	print_list(list);
	append(list, 20);
	print_list(list);
```

This program will print these lines to the console:

> ```
> 10
> 10 -> 20
> ```

The program might seem intimidating at first, but let's unpack it bit by bit. First, we defined our `IntList` data type with a body representing it's value and an optional next element in the list. We have gone through the fact that optionals which hold complex data types actually hold references to data internally. So, we use the `IntList?` typed field for the next element in the linked list. We could put anything and any field inside our `IntList` definition. This also is the absolute most basic form of a linked list there is. When entities work eventually, we will learn quite a lot of more complex list examples.

You can try around a bit. Write a `prepend` function, or write a function which prints the list in reverse order. Try around a bit in the list example. If you can fully create, understand and extend the list example you will get a feeling for optionals in Flint quicker than you might think.
