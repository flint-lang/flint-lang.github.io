# Ranges

A range describes a set of numbers with a clear start and end number. The simplest range expression would be something like `0..6`. This range expression describes all values from `0` to (exclusive) `6`. So, the numbers `0`, `1`, `2`, `3`, `4` and `5` but not `6`. All ranges in Flint follow the form of `[x, y)`, meaning that the lower bound is always the starting point and the upper bound is always the end point. Think of it like the "bounds" of a for loop. In a for loop you also write

```ft
for i32 i = 0; i < 6; i++:
    ...
```

The start of the loop is at `0` and it exists when `i` is at `6`. So, in the body of the loop `i` will have the values from 0 to exclusive 6, and it's the same with ranges actually. So, when we write `0..6` remember that the 6 is not included in the range.

## Slices

What are slices? Each language has it's own concept of "slicing" and slices. A slice is essentially just a small segment of a larger structure, extrapolated from it and looked at in isolation. The easiest example to showcase slices are actually strings. Let's look at the following example:

```ft
use Core.print

def main():
	str string = "Hello there";
	str slice = string[2..7];
	print($"{string}\n");
	print($"{slice}\n");
```

This program will print these lines to the console:

> ```
> Hello there
> llo t
> ```

As you can see, we *sliced* a small part from the string out and created a new string from it. We did not modify the original sting, nor do we have a "veiw" into the original string. So, we essentially copied the string `[from, to)`. String slicing is acctually *very* important, because some times you need to strip of things of the beginning or the end of your string. So, let's look at special ranges next: open ranges.

## Open ranges

An open range just means that we do not write a number on a side of the range `..`. A possible open range would be `2..`. See how we have the same starting point but no end point specified? Let's look at what happens if we use that range to slice the same string as above:

```ft
use Core.print

def main():
	str string = "Hello there";
	str slice = string[2..];
	print($"{string}\n");
	print($"{slice}\n");
```

This program will print these lines to the console:

> ```
> Hello there
> llo there
> ```

We have successfully stripped the first two characters of the string, just through slicing. The open-ended range like `2..` just means **from `2` to `end`**. In our case that `end` would be `string.length`. And this is also the reason to why the end is always exclusive. If we write `0..(string.length)` then it would crash if the end would be inclusive. Without slicing this would require a loop like so:

```ft
use Core.print

def get_slice(str src, u64 from, u64 to) -> str:
	str res = "";
	for u64 i = from; i < to; i++:
		res = res + str(src[i]);
	return res;

def main():
	str string = "Hello there"
	str slice = get_slice(string, u64(2), string.length);
	print($"{string}\n");
	print($"{slice}\n");
```

This program will print these lines to the console:

> ```
> Hello there
> llo there
> ```

As you can see it has the same output, but it will run **much** slower because of the loop and the string concatenation and calculations. Always use slicing if you can.

## Performance difference

Let's test how slow it really is real quick.

```ft
use Core.print
use Core.time

def get_slice(str src, u64 from, u64 to) -> str:
	str res = "";
	for u64 i = from; i < to; i++:
		res = res + str(src[i]);
	return res;

def main():
	str string = "Hello there"

	TimeStamp t0 = now();
	for i := 0; i < 1_000_000; i++:
		str slice = get_slice(string, u64(2), string.length);

	TimeStamp t1 = now();
	for i := 0; i < 1_000_000; i++:
		str slice = string[2..];

	TimeStamp t2 = now();
	Duration manual_time = duration(t0, t1);
	u32 manual_time_ms = u32(as_unit(manual_time, TimeUnit.MS));
	Duration slice_time = duration(t1, t2);
	u32 slice_time_ms = u32(as_unit(slice_time, TimeUnit.MS));
	print($"manual: {manual_time_ms} ms\n");
	print($"slice: {slice_time_ms} ms\n");
```

This program will have an output similar to this:

> ```
> manual_time: 300 ms
> slice_time: 16 ms
> ```

Note that this is only the performance on My machine, it can be very different to the performance you are getting. As you can see, the performance differs quite a lot between the manual slicing and range-based slicing.

Lastly, let's talk about the other open ranges: `..5` means "from begin to 5" and is the same as if you would write `0..5` and you can also just write `..` without any numbers at all. This range then just means "from begin to end" and it essentially just creates a copy of the whole string, and for that you could just assign the string too, it will be faster this way.

## Iterating over ranges

Ranges also count to the **iterable** types. This means that we can iterate over ranges using enhanced for loops:

```ft
use Core.print

def main():
	u64 start = 5;
	u64 end = 10;
	for (i, elem) in start..end:
		print($"{i}: {elem}\n");
```

This program will print these lines to the console:

> ```
> 0: 5
> 1: 6
> 2: 7
> 3: 8
> 4: 9
> ```

If you just need to iterate from a given value to a given value then ranges + enhanced for loops are a much more elegant solution compared to the c-style for loops:

```ft
// c-style for loop
for u64 i = 0; i < 10; i++:
	// ...

// enhanced for loop + ranges
for (i, _) in 0..10:
	// ...
```
