# Monolithic Entities: The Basics

The simplest form of an entity in Flint is a **monolithic entity**, where data and functionality are defined together in one place.

## Example:

```rs
entity Counter:
    data:
        int value;

    func:
        def increment(int amount):
            value += amount;

        def get_value() -> int:
            return value;

    Counter(value); // Constructor to initialize the entity
```

## Key Points:

1. **Structure:** Entities have two main sections:
   - **Data:** Variables that store the state of the entity.
   - **Func:** Functions that operate on the data.
2. **Constructor:** The constructor initializes the entity. Its parameters must match the declared fields in the `data` section.
3. **Use Case:** Monolithic entities are straightforward and perfect for small projects or tightly coupled logic.
4. **Immutability:** The data saved inside an entity cannot be accessed outside of func modules. So, when Entity `E` uses a func module which acts on data `D` the data of `D` cannot be accessed via an instance of `E`. This means that `e.value` is impossible. For all operations on data, getters and setters must be provided inside the `func` module.

## Usage Example:

```rs
def main():
    Counter counter = Counter(0);
    counter.increment(5);
    print($"Counter value: {counter.value}");
    counter.reset();
    print($"Counter value after reset: {counter.value}");
```

Monolithic entities are Flint’s simplest abstraction, but their true power emerges as we explore **func modules**.
