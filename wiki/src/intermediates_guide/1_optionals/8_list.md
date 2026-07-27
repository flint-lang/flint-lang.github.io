# List Example

Now that we have optionals at our disposal and we know that optionals are references to actual values (sometimes), we can build our first liked list in Flint! If you want to learn more about what a linked list actually is, i recommend you to look [here](https://www.w3schools.com/dsa/dsa_theory_linkedlists.php). Lets look at how a linked list looks in Flint:

```ft
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
	print(list.value);
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

The program might seem intimidating at first, but lets unpack it bit by bit. First, we defined our `IntList` data type with a body representing its value and an optional next element in the list. We have gone through the fact that optionals which hold complex data types actually hold references to data internally. So, we use the `IntList?` typed field for the next element in the linked list. We could put anything and any field inside our `IntList` definition. This also is the absolute most basic form of a linked list there is. Together with optionals you could create much more powerful linked list implementations, but focusing purely on the `data` component here makes sense since it's a lot easier to understand.

While we were not able to create recursive types earlier (a `data` component including that same component as a field), we are able to do it now. Because we can manually iniitalize the "next" field to `none`, the entire data component becomes initializable, wehereas without an optional it would not be possible to initialize it.

You can try around a bit. Write a `prepend` function, or write a function which prints the list in reverse order. Try around a bit in the list example. If you can fully create, understand and extend the list example you will get a feeling for optionals in Flint quicker than you might think.
