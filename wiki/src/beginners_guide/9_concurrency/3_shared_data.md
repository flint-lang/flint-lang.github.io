# Shared Data

While Flint’s design prevents race conditions by default, there are cases where **data sharing** between entities or threads is necessary. For these situations, Flint introduces **shared data**.

## What is Shared Data?

Shared data is a special type of data module designed to be accessed by multiple threads or entities concurrently. Unlike regular data, shared data resides in the **Heap**, and Flint enforces synchronization to ensure safe access.

## Syntax:

```rs
shared data SharedCounter:
    int value = 1;
```

As you may notice, **shared data** does not have a constructor. Why is that? Well, because it only exists **once** in the whole program. This also means that shared data cannot be initialized and used inside a variable. Its main purpose is to **connect** multiple entities, maybe of differnt type, where everyone of these entities can access and modify the data in a thread-safe way without much headache.

**Imporant:** Every field inside a shared data module **must** have default values set. This is because the module gets created with the programs startup.

Shared data houses mutex-checks by default, meaning that only a single thread can access the data at a time. The nice thing about shared data is, that inside this data module, more complex data types than only primitive types can be created too. This is because shared data cannot be initialized, and because a shared bit was introduced in DIMA (Dynamic Incremental Memory Allocation) (Flints memory management tool) (but you will learn more about it some time later).

## Accessing Shared Data

## When to Use Shared Data
- **Global State:** For variables that must be shared across multiple entities or functions.
- **Coordination:** When threads need to communicate through shared variables.

## Example:

```rs
shared data PlayerScore:
    int highscore = 0;

// The PlayerScore p here is not an instance from but only a reference to the data module
func ScoreUtils requires(PlayerScore p):
    def set_highscore(int score):
        p.highscore = score;

    def get_highscore() -> int:
        return p.highscore;

entity ScoreManager:
    data: PlayerScore;
    func: ScoreUtils;
    // The PlayerScore is not allowed nor needed inside the constructor
    // because it is shared
    ScoreManager();

entity Player extends(ScoreManager m):
    data:
        HealthData;
    func:
        HealthUtils;
    // The ScoreManager does not have to be listed here because its constructor is empty
    Player(HealthData);

def main():
    // initializes a player with 100 health
    player := Player(100);
    print(player.get_highscore()); // prints '0'
    player.set_highscore(100));
    // because the ScoreManager is a regular entity, it can be instantiated too!
    manager := ScoreManager();
    print(manager.get_highscore()); // prints '100'
    manager.set_highscore(50);

    print(player.get_highscore()); // prints '50'
```

By default, Flint minimizes the need for shared data, promoting safer designs. Use shared data only when absolutely necessary. Use it sparingly because the additional mutex-checks to avoid race conditions make accessing shared data much slower compared to accessing "normal" data, especially in concurrent scenarios.

## Conclusion

Flints concurrency approach, through its DOCP paradigm, is inherently simpler than in many other languages. Because Flint focuses on data modules themselves, their encapsulation and separation, it becomes much simpler to prevent race conditions or other problems related to concurrency.

You have learned a big chunk of Flints features by now. While you do not yet know everything, lets focus next on building a small program. Lets then focus on making a small library and publishing it on **FlintHub** to begin your collaborative Flint journey!
