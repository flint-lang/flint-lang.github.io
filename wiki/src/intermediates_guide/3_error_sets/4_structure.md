# The Error Structure

**Every** error is represented the exact same way in memory:

```c
struct {
	u32 type_id;
	u32 value_id;
	str *message;
}
```

The `type_id` is a unique id of the error set type. It is the result of a hashing function, where the name of the error set type is being hashed. This means that the same error set will _always_ result in the same type id. The `value_id` is the index of the actual thrown value. Given these error sets:

```ft
error ErrBase:
	B1, // value 0
	B2; // Value 1

error ErrSpecial1(ErrBase):
	S1, // value 2
	S2; // value 3

error ErrSpecial2(ErrBase):
	S1, // value 2
	S2; // value 3

error ErrSuperSpecial(ErrSpecail1):
	SS1, // value 4
	SS2; // value 5
```

you can cleary see in the example how the values directly correlate to which error it is. For example when writing `ErrSuperSpecial.S1` the error set type is of type `ErrSuperSpecial` but the `value_id` is value `2`.

When we have a variable which is a error set type, we can directly access those fields through their names through `type_id`, `value_id` and `message`. Here is a small example showcasing this:

```ft
use Core.print

error ErrArithmetic:
	NullDivision, Negative;

def divide(i32 x, i32 y) -> i32 {ErrArithmetic}:
	if y == 0:
		throw ErrArithmetic.NullDivision;
	if x < 0 or y < 0:
		// We just made up that error just to have a second error case
		throw ErrArithmetic.Negative;
	return x / y;

def main():
	i32 res = divide(10, 0) catch err:
		switch err:
			ErrArithmetic(e):
				print($"type_id = {e.type_id}\n");
				print($"value_id = {e.value_id}\n");
				print($"message = {e.message}\n");
				switch e:
					NullDivision: print("Is NullDivision\n");
					Negative: print("Is Negative\n");
			anyerror(e):
				print("Is anyerror\n");
	print($"res = {res}\n");
```

This program will print these lines to the console:

> ```
> type_id = 1560177182
> value_id = 0
> message =
> Is NullDivision
> res = 0
> ```

As you can see, the `NullDivision` is value `0` and the hashing function outputs the `u32` hash of `2646001312` for the type `ErrArithmetic`.

## Casting errors to strings

But those values, the `type_id` and the `value_id` should be purely internal. It is uncertain whether we will remove the ability to access them directly in the future, but what is certain is that you should not use them. Instead of printing the above example like `type_id = ...` and `value_id = ...` you should use the ability to cast errors to strings:

```ft
use Core.print

error ErrArithmetic:
	NullDivision, Negative;

def divide(i32 x, i32 y) -> i32 {ErrArithmetic}:
	if y == 0:
		throw ErrArithmetic.NullDivision;
	if x < 0 or y < 0:
		// We just made up that error just to have a second error case
		throw ErrArithmetic.Negative;
	return x / y;

def main():
	i32 res = divide(10, 0) catch err:
		switch err:
			ErrArithmetic(e):
				print($"err = {e}\n");
				print($"message = {e.message}\n");
				switch e:
					NullDivision: print("Is NullDivision\n");
					Negative: print("Is Negative\n");
			anyerror(e):
				print("Is anyerror\n");
	print($"res = {res}\n");
```

This program will print these lines to the console:

> ```
> err = ErrArithmetic.NullDivision
> message = 
> Is NullDivision
> res = 0
> ```

As you can see, the `message` field is not turned into a string when casting an error to a strings. This is intentional, since now you can choose for yourself whether you want to have the message in the string (for example through doing `$"{e}: {e.message}"`).
The `type_id` and `value_id` fields will no longer be accessed throughout the rest of the guide, from now on we cast errors to strings in all examples.

The `type_id` id is dependant on the relative path of the file the error is defined in. This means that, while the `type_id` is stable across machines as long as the compiler is executed in the same relative path to the file, it still can differ. So, you should definitely ***NOT*** try to do something like `err.type_id == 2349234209` for example. First of all, that would be a magic number, and second of all the hash (type_id) is dependant from the relative path. You definitely should *not* access nor use the `type_id` directly, using a switch is the preferred approach.

For now the `type_id` and `value_id` fields stay in there, but being able to access them will be removed some time in the future.
