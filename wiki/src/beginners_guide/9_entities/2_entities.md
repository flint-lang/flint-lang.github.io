# Entities

A **monolithic entity** can be split into **data** and **func modules**, improving modularity and reusability.

## Example:

```ft
data CounterData:
    int value;
    CounterData(value);

func CounterActions requires(CounterData c):
    def increment(int amount):
        c.value += amount;

    def get_value() -> int:
        return c.value;

entity Counter:
    data:
        CounterData;
    func:
        CounterActions;
    Counter(CounterData);

def main():
    Counter c = Counter(0);
    c.increment(5);
    print(c.get_value());
```

## Key Points:

1. **Splitting Structure:** Data and behavior are now split into distinct modules, improving maintainability and reducing duplication.
2. **Cleaner Logic:** You can focus on either the data or behavior separately when extending or debugging the entity.

This separation shines when working with **complex entities**.

## Additional Information:

When creating and using monolithic entities, the compiler inherently creates `data` and `func` modules for that entity. It keeps modular. The `Counter` example from chapter 8.1:

````ft
entity Counter:
    data:
        int value;

    func:
        def increment(int amount):
            value += amount;

        def get_value() -> int:
            return value;

    Counter(value); // Constructor to initialize the entity
``

will be converted by the compiler to this structure:

```ft
data DCounter:
    int value;
    DCounter(value);

func FCounter requires(DCounter d):
    def increment(int amount):
        d.value += amount;

    def get_value() -> int:
        return d.value;

entity Counter:
    data:
        DCounter;
    func:
        FCounter;
    Counter(DCounter);
````

This means that monolithic entites are being modularized internally. So there is no difference performance-wise when using very small monolithic or modular entities. However, as the entity becomes bigger and bigger, the performance gains from using modular entites become increasingly bigger.

So, when using very small entites or for **quick prototyping**, creating monolithic entites can be beneficial. But for bigger entities, please use the modular design.
