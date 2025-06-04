# Introducing Links

Links allow you to **connect func modules**, enabling communication and coordination. This is achieved using the `#linked` flag and the `->` operator in the `link:` section of the entity.

## Syntax Recap:

```rs
// POSITION MODULES
data Position:
    int x;
    int y;
    Position(x, y);

func PositionUtils requires(Position p):
    def move():
        (dx, dy) := get_velocity();
        p.x += dx;
        p.y += dy;

    def get_position() -> (int, int):
        return (p.x, p.y);

    #linked
    def get_velocity() -> (int, int);
```

```rs
// VELOCITY MODULES
data Velocity:
    int dx;
    int dy;
    Velocity(dx, dy);

func VelocityUtils requires(Veclocity v):
    #linked
    def get_velocity() -> (int, int):
        return (v.dx, v.dy);
```

```rs
// MAIN ENTITY
entity MovingObject:
    data:
        Position, Velocity;
    func:
        PositionUtils, VelocityUtils;
    link:
        PositionUtils::get_velocity -> VelocityUtils::get_velocity;
    MovingObject(Position, Velocity);

def main():
    obj := MovingObject(10, 7, -2, 2);
    print(obj.get_position()); // prints '(10, 7)'
    obj.move();
    print(obj.get_position()); // prints '(8, 9)'
```


## Key Points:
1. **Linked Functions:** Functions marked with `#linked` must be linked in the `link:` section of the entity.
2. **Compilation Behavior:** If multiple functions are linked, only the **end-point** function is included in the compiled program.
3. **Forced Override:** When multiple functions with the same name and the same signature coexist in multiple func modules, they have to be linked together. The function at the end of the linking chain will be executed.
4. **Flags Required:** Each function that is linked has to be marked with the `#linked` flag.

Links enable powerful abstractions and create **cohesion** across entities while keeping their implementations **decoupled**.
