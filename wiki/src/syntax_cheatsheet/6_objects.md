# Objects

## Simple Object

Composition-based; **no inheritance**.

```ft
object Player:
    // composed data
    data: Transform t;
    // object constructor
    Player(t);

    // methods (owning)
    def move():
        t.pos += t.dir * t.speed;

    const def print_position():
        print($"t.pos = {t.pos}\n");

def main():
    Player player = Player(Transform((1.2, 3.4), (4.5, 6.7), 0.12));
    player.move();
```

Object data is stored separately and is encapsulated; only functions of the object or its composed `func` components can touch it.

## Func Components

```ft
// required data becomes implicit params
func Movement requires(Transform t):
    def move():
        t.pos += t.dir * t.speed;

    const def print_position():
        print($"t.pos = {t.pos}\n");
```

Call via the component name; the required data is passed first:

```ft
Movement.move(t);
Movement.print_position(t);
```

Desugars to `def Movement.move(mut Transform t):`. Required types must be unique (`data` types only); a pure func (no `requires`) works too, e.g. `Math.add(10, 20)`.

## Composition

```ft
object Dog:
    data: Legs;
    func: Run, Jump;
    Dog(Legs);

object Bird:
    data: Wings, Legs;
    func: Fly, Run, Jump;
    Bird(Wings, Legs);
```

```ft
d := Dog(...);
d.run();
d.jump();

b := Bird(...);
b.fly();
```

If an object misses a data component that an included func requires, it's a compile error.

## Signatures

- **Explicit signature** is what you write; the **implicit signature** is the desugared one (`mut Transform -> void`).
- Required data is mutable by default; mark a function `const def` when it doesn't mutate (`const Transform t`).
- Object methods always take an implicit `self` first: `def Counter.inc(mut Counter self, n)`. Delegating works via `self.fn1();`.
- Calling a composed func on an object passes the object's data pointers: `obj.somecall()` -> `FuncType.somecall(obj.$0, obj.$2)`.

## Func Instances

A func component can be stored as an instance to form a view over an object's data:

```ft
// object o contains func Func
Func f = o;

// mutates o's data
f.inc(3);
o.print();
```

The only way to build a func instance is from an object containing the component. DIMA keeps the data pointers valid if the object goes out of scope.

## Interfaces

```ft
interface Serializable:
    // virtual function: declaration only
    const def to_string() -> str;
```

```ft
// implements clause is used to define which interfaces this object implements
object Object1 implements(Serializable):
    data: Data d;
    Object1(d);

    // concrete implementation
    const def to_string() -> str:
        return $"\{ x: {d.x} \}";
```

Interface instances give polymorphism; any implementing object works:

```ft
def serialize(Serializable s):
    print($"s.to_string() = {s.to_string()}\n");

def main():
    o1 := ObjectType1(...);
    serialize(o1);

    o2 := ObjectType2(...);
    serialize(o2);
```

Linking matches on the **explicit** signature (`() -> str`), not the implicit one.
