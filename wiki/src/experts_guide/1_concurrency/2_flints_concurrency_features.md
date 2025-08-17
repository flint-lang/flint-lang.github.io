# Flint's Concurrency Features

Flint offers several built-in tools for concurrency, with `run_on_all` being a standout feature. These tools abstract away the complexity of managing threads, making Flint one of the easiest languages to adopt for concurrent programming.

### `run_on_all`: The Basics

The `run_on_all` function distributes a task across all elements of an iterable or entities in a collection, running each task concurrently.

Syntax:

```
run_on_all(FUNC_OR_ENTITY_TYPE, FUNCTION_REFERENCE, [COLLECTION]);
```

## How It Works

When an entity type is provided for the **FUNC_OR_ENTITY_TYPE**, the function given in the **FUNCTION_REFERENCE** will be executed on **all** entites of this type. This method is overloaded with another method, having one additional argument, the **COLLECTION**. A collection can be an array of entites or funcs, or a list of them.

## Example:

```ft
entity SomeEntity:
    data:
        int value;
    func:
        def increment_value(int amount):
            value += amount;
    SomeEntity(value);

def main():
    arr1 := SomeEntity[100](SomeEntity(15));
    arr2 := SomeEntity[50](SomeEntity(25));

    // Increments the value of **ALL** existing entities of this type
    // This includes all entities from 'arr1' as well as all from 'arr2'
    run_on_all(SomeEntity, SomeEntity::increase_value(3));

    // Increments the value of all entities in 'arr1'
    run_on_all(SomeEntity, SomeEntity::increase_value(5), arr1);
```

Something important: A **function reference** is made via the `::` symbols (double colon). Because Flint differentiates between function calls with `.` and function references with `::`, the value with which the function is referenced can be bound to the function reference exaclty like a normal function call, instead of using `.bind(...)` or something similar to it. This greatly imroves the ease of use for function references.

## Other Concurrency Functions

Flint provides additional concurrency functions, including:

- **`map_on_all(FUNC_OR_ENTITY_TYPE, FUNCTION_REFERENCE, [COLLECTION]) -> List<ResultType>`:** Similar to the `map` function in other languages, `map_on_all` would run a specified function across **all** or **some** entities, depending if the collection argument is passed in or not. It collects all the results of the function in a new `List`. Here an example:

```ft
// Assuming that 'increase_value' returns the new value as an 'int'
List<int> results = map_on_all(SomeEntity, SomeEntity::increase_value(5));
```

- **`filter_on_all(FUNC_OR_ENTITY_TYPE, FUNCTION_REFERENCE, [COLLECTION]) -> List<EntityType>`:** Similar to the `filter` function in other languages, `filter_on_all` executes a given predicate function and returns a list of all entities or funcs, where the predicate function resolved to true. Here an example:

```ft
// Assuming that the 'is_value_above' function exists and returns a 'bool'
List<SomeEntity> filtered = filter_on_all(SomeEntity, SomeEntity::is_value_above(5));
// This filtered list then can be used in other concurrent functions as well
// Concurrent functions are inherently modular and can be chained together to create powerful commands
run_on_all(SomeEntity, SomeEntity::decrease_value(5), filtered);
```

There exist several more concurrent functions, such as `reduce_on_all`, `reduce_on_pairs` or `partition_on_all`. Now that you understand how they work and how to use them, explore them by yourself!

<!-->

- **`run_in_parallel(func1, func2, ...)`:** Runs multiple independent functions concurrently.
- **`run_with_limit(func, collection, limit)`:** Similar to `run_on_all`, but limits the number of concurrent tasks.
- **`run_once(func)`:** Ensures a function runs exactly once, even in concurrent contexts.
  <-->
