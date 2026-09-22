# array

```ft
use Core.array
```

The `array` module provides low level functionality around one-dimensional arrays.

## functions

These are the functions this Core module provides.

### shrink

```ft
def shrink[type T](mut T[] arr, u64 by);
```

This function shrinks the array by `by` elements. This function does, unlike `resize`, not require the type to be default-initializable because the function strictly and always shrinks the passed-in array and frees the shrinked elements if they are freeable (complex types). The parameter `by` is always clamped to `arr.len` so calling it with a very high `by` on an empty array, for example, is well-defined behaviour. This function can be used to create higher level functionality like the `clear` function, for example:

```ft
def clear[type T](mut T[] arr):
    shrink[T](arr, arr.len);
```

### resize

```ft
def resize[type T](mut T[] arr, u64 size);
def resize[type T](mut T[] arr, u64 size, T default);
```

This function changes the size of the passed-in `arr` directly in-line. If `size` is smaller than the `arr.len`, the elements which are too much will be freed. If `size` is larger than `arr.len` then new values will be created and added to the array. This function is only callable on arrays whose base-type is default-initializable. If `T` is not default-initializable, like a variant for example, then this function will fail.

For non-default-initializable types the overload with the default-value needs to be called instead, so you then needs to manually provide a default-value in this case.

### insert

```ft
def insert[type T](mut T[] arr, T value, u64 i);
```

Inserts a single value into the array. Note that the index is clamped to the length of the array, so you can never insert a value outside the range of the array. This function always clones the passed-in value, general clone rules (assignment-like) apply. Note that memory of the array is never copied or cloned, as the array itself will be relocated and some elements are potentially moved in it (memmove). With this function you are able to create higher level wrappers like `append` and `prepend` yourself:

```ft
def append[type T](mut T[] arr, T value):
    insert[T](arr, value, arr.len);

def prepend[type T](mut T[] arr, T value):
    insert[T](arr, value, 0);
```

As `Core` modules only contain the lowest levels of functionality, this function is meant to be used to build higher level abstractions on top of it.

### remove

```ft
def remove[type T](mut T[] arr, u64 i) -> T?;
```

Removes a single element from the array and returns it. The function will return `none` if the array was empty or the index was out of bounds of the array. The element, if the given index is valid, will be *removed* from the array, meaning that the array shrinks as a result. With this function you are able to create higher level wrappers like `pop_back` and `pop_front` for example:

```ft
def pop_front[type T](mut T[] arr) -> T?:
    return remove[T](arr, 0);

def pop_back[type T](mut T[] arr) -> T?:
    if arr.len == 0:
        return none;
    return remove[T](arr, arr.len - 1);
```

### merge

```ft
def merge[type T](mut T[] arr, mut T[] src, u64 i);
```

Merges the `src` array into the `arr` at position `i`. If you have an array like `[1, 2, 3, 4, 5]` and you merge `[0, 0, 0]` into `i=2` the resulting array will be `[1, 2, 0, 0, 0, 3, 4, 5]` and `src` will be empty. This function does not clone any values, as both `arr` and `src` will be mutated. With this function you are able to create higher level wrappers like `append` and `prepend` working on arrays for example:

```ft
def prepend[type T](mut T[] arr, mut T[] src):
    merge[T](arr, src, 0);

def append[type T](mut T[] arr, mut T[] src):
    merge[T](arr, src, arr.len);
```
