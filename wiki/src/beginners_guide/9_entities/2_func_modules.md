# Func Modules: Modularizing Behavior

Func modules separate **behavior** from entities, making Flint entities highly modular. They **act upon data** and can be reused across multiple entities. A func module defines functionality independently of a specific entity.

## Syntax Recap:

```ft
data CounterData:
    int value = 0;
    CounterData(value);

func CounterActions requires(CounterData c);
    def increment(int amount):
        c.value += amount;

    def get_value() -> int:
        return c.value;
```

## Key Points:

1. **Requires Keyword:** The `requires` keyword specifies the data module(s) this func module operates on. In this case, it requires a data module of type `Counter`. This data module has to be present on every entity that uses the `CounterActions` func module.
2. **Reusability:** A single func module can be shared across multiple entities that use compatible data structures.
3. **Immutability:** Just like with monolithic entities, the data saved inside an entity cannot be accessed outside of func modules. So, when Entity `E` uses a func module which acts on data `D` the data of `D` cannot be accessed via an instance of `E`. This means that `e.value` is impossible. For all operations on data, getters and setters must be provided inside the `func` module.

By separating behavior from data, Flint encourages **reuse** and **cleaner code**. But how do these fit into entities?
