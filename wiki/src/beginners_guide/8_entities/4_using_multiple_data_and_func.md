# Using Multiple Data and Func Modules

Entities can incorporate multiple **data modules** and **func modules**, making them powerful abstractions for complex systems.

## Example:

```rs
data Position:
    int x;
    int y;
    Position(x, y);

data Velocity:
    int dx;
    int dy;
    Velocity(dx, dy);

func MovementActions requires(Position p, Velocity v):
    def move():
        p.x += v.dx;
        p.y += v.dy;

entity MovingObject:
    data:
        Position, Velocity;
    func:
        MovementActions;
    MovingObject(Position, Velocity);
```

## Key Points:
1. **Combining Data:** Entities can hold multiple data modules, each serving a specific purpose.
2. **Behavior Composition:** Multiple func modules can act on the same data or different data modules within the entity.

This modular design fosters **collaboration**, where one developer can work on movement while another focuses on graphics.

It is generally not recommended to make any func dependant on many different data modules. The more dependent every func is on multiple different data modules, the less modular the whole system becomes. This would mean that the advantage **DOCP** has over **OOP** would diminish. It is not easy to keep function and data as modular as possible, but **link** help with that. Links are described in the next chapter and they greatly increase the possibilities of DOCP.
