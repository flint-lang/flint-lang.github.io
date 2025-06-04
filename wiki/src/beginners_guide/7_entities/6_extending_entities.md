# Extending Entities

The `extends` keyword allows you to create new entities that build upon existing ones. This is similar to inheritance in object-oriented programming.

## Syntax Recap:

```rs
entity Movement:
    data:
        int x_pos = 0;
        int y_pos = 0;
        int x_vel = 0;
        int y_vel = 0;
    func:
        def move():
            x_pos += x_vel;
            y_pos += y_vel;
    Movement(x_pos, y_pos, x_vel, y_vel);

entity Player extends(Movement mv):
    data:
        int health = 100;
        int damage = 10;
    func:
        def recieve_damage(int amount):
            health -= amount;
    Player(mv, health, damage);

def main():
    mv := Movement(10, 10, 1, 2);
    player := Player(mv, 100, 10);
    player.move(); // Calling the function inherited by the Movement entity;
```

## Key Points:

1. **Data and Func Inheritance:** The new entity inherits all `data`, `func` and `link` modules from the parent entities.
2. **Extending Behavior:** Additional functionality can be added without modifying the original entity.

## Conclusion

Entities are Flint’s way of organizing and structuring both data and behavior. From **monolithic entities** to modular data and func modules, extending entities, and linking behavior, Flint entities provide the **flexibility** and **power** needed for modern, scalable applications.

Extending entities simplifies code reuse while keeping functionality **modular**. Together with the ability to link functions, a structure similar to "classic" OOP emerges, but the data is strictly separated, just like functions. Allthough links are very powerful, they can introduce headaches in concurrent environments. Use them with caution! As long as you use them in a **readonly** way (making a *dummy* function in the current func and linking it to the function in the *func* module which has access to the data, and only making it **read** the data, but never **write** it), you should see minimal to no problem with concurrency, which is talked about in the next chapter.

Up next: **Concurrency**, where we explore Flint’s capabilities for high-performance, parallel computing!
