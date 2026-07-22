# Composition

An `object` can not only include `data` components but it also is able to include `func` components. This is the back-bone of Flints composition-based design and world-view. We create small and simple reusable `data` and `func` components and then compose them in many different `object` types. But before we can dive a bit deeper into how to compose them, we need to talk a bit about inheritance-based design vs composition-based design a bit.

I know Flint is technically still OOP, but I use OOP as a term to describe inheritance-based designs in general here.

In an OOP-world, where classes inherit other classes you would get a **identity hierarchy** tree. In this world you are always asking what something *is*. *Is* this class, like `Dog` an `Animal`? OOP is filled with the question about identity, whether something *is* a specialization of something more general.

This question about identity helps in modelling *type relationships* of classes but it comes with a cost, both mentally and in the runtime. Casting specialized objects to more generous ones, the potential of `null`ability if casting fails etc. In the world of composition you do not ask yourself what something *is* but rather what something *has*. You do not care about it's **identity**, you only care about it's **capabilities**. For example, in that previous example about animals, which is a *very* common early-teaching OOP example, we would model it very differently in Flint.

Here is some Java code (Java is used as "the OOP language" in this example since it's pretty easy to understand, [source](https://medium.com/@tejasrisony17/oops-concepts-with-examples-in-java-1166a0d3772)):

```java
class Animal {
    String name;
    int legs;

    void eat() {
        System.out.println(name + " is eating.");
    }

    void move() {
        System.out.println(name + " is moving.");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("Woof!");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.name = "Buddy";
        myDog.legs = 4;
        myDog.eat();    // Inherited method
        myDog.move();   // Inherited method
        myDog.bark();   // Dog-specific method
    }
}
```

As you can see very clearly, we always ask about *identity* in OOP-languages, a `Dog` **is** an `Animal` and through this mindset of identity we always ask ourselves questions like "What does a `Dog` do what an `Animal` in general does not?", "What's something which *every* `Animal` has and does?" or "Should we split it further into `LandAnimal`, `SeaAnimal` etc?". As you can see easily the OOP world is full of questions, because *identity* is not as easy to grasp and model as it may seem at first sight. It is very easy to understand, but it is not easy to find the right abstraction in OOP. You often end up with over-abstracted systems just because you tried to be "correct" with your identities.

In the world of composition these questions do not disappear entirely, but you will start to gain a different mindset, and you will start to ask different questions, not related to *identity* but *capability*. For example instead of asking what an animal in general *is* you can just start modelling *capabilities* of animals in general. The questions which arise from this different mindset are easier to answer generally speaking compared to inheritance-based questions. For example, an animal might be able to **swim**, **dive**, **fly**, **run** or **jump**. You start modelling all these capabilities and start questioning yourself: What **properties** does each of these capabilites need? To be able to **swim** there is no true one **requirement** for this **capability**. The same is true for **dive**. But to be able to **fly** you *definitely* need `Wings`. To be able to run or jump you *definitely* need `Legs`. So in our example it may look like this:

```ft
use Core.print

data Wings:
	u32 size; // The size of the wings
	u32 flight_time; // How long we are able to fly
	Wings(size, flight_time);

data Legs:
	u32 count; // How many legs we have
	f32 speed; // How fast we are able to run
	f32 height; // How high we are able to jump
	Legs(count, speed, height);

func Fly requires(Wings w):
	def fly():
		print($"Starting to fly for {w.flight_time} seconds with my {w.size}cm large wings\n");

func Run requires(Legs l):
	def run():
		print($"Starting to run with my {l.count} legs with a speed of {l.speed} km/h\n");

func Jump requires(Legs l):
	def jump():
		print($"Jumping {l.height}m high with my {l.count} legs\n");

object Dog:
	data: Legs;
	func: Run, Jump;
	Dog(Legs);

object Bird:
	data: Wings, Legs;
	func: Fly, Run, Jump;
	Bird(Wings, Legs);

def main():
	d := Dog(Legs(4, 30.0, 0.8));
	d.run();
	d.jump();

	print("\n");
	b := Bird(Wings(10, 100), Legs(2, 1.5, 0.1));
	b.run();
	b.jump();
	b.fly();
```

This program will print these lines to the console:

> ```
> Starting to run with my 4 legs with a speed of 30 km/h
> Jumping 0.8m high with my 4 legs
>
> Starting to run with my 2 legs with a speed of 1.5 km/h
> Jumping 0.1m high with my 2 legs
> Starting to fly for 100 seconds with my 10cm large wings
> ```

You may be able to see that we now could add more and more capabilities to the system, like being able to make a sound, having claws, having sharp teeth, being able to eat plants or being able to eat meat. If an animal can eat both then it automatically becomes omnivorous. The more capabilities we add the easier it becomes to model different animals, since we can just re-use all of our already existing capabilities.

To think in terms of composition definitely requires a shift in mindset, if you try to model everyting the "OOP-way" in Flint you will find yourself hitting your head against a wall. Flint requires a different mindset when modelling your entities and if you can't gain this different midset then you will have a hard time with Flint. But if you are open to this new mindset I promise you that you will be able to enjoy Flint a lot, since this whole mindset makes it very easy to model and extend your already existing systems without refactoring it all, like you often times need in OOP when identities change.

Inheritance is a great concept, but for Flint we choose to go a different road. You may come across problems where composition just does not fit, and that's totally okay. Some problems requires hard identity-relationships and its okay to use different languages for these sorts of problems. Flint is not a language that tries to be everything for everyone like C++ tries to be, that's a good thing.

In the above example you already saw how we can compose multiple `func` components in an `object`. We simply write `func:` and list all components included in that object.

## Encapsulation

The data of an object can **never** be accessed from the outside world. This means that you cannot just write `o.$0` for example, since an object is not a tuple on the surface. **Object data can only be modified from within functions defined at the object level or in included func components**. This means that whenever you want to modify any object data you need to modify it through a call on the object instance variable itself. An object **owns** it's data, which means that you cannot get a reference to its data by any means either, as this would break the encapsulation guarantees.

Here a small example to showcase that:

```ft
use Core.print

data Transform:
	i32x2 pos;
	i32x2 size;
	Transform(pos, size);

func FMove requires(Transform t):
	def print():
		print($"pos: {t.pos}, size: {t.size}\n");

	def get_pos() -> i32x2:
		return t.pos;

object Object:
	data: Transform;
	func: FMove;
	Object(Transform);

def main():
	o := Object(Transform(i32x2(100, 120), i32x2(200, 220)));
	o.print();
	print($"o.pos = {o.get_pos()}\n");
```

This program prints these lines to the console:

> ```
> pos: (100, 120), size: (200, 220)
> o.pos = (100, 120)
> ```

This *may* seem inefficient or boiler-platy, but this design has big impications regarding multi-threading safety and general code safety, but this is a topic of a waaaay later chapter in the Expert to Master book (once multi-threading is implemented of course, it is not yet). In this example, you can see that once we created an object of type `Object` we can no longer access its composed data (`Transform`) directly. We can only access it using functions which are either defined at a included `func` component or defined at the object-level itself.

## Missing data

There are only a few reasons to why we `require` any data in `func` components at all. The first reason is that whenever we call a function like `print` on the object `o` we *know* that this function *only* ever touches the `Transform` data of the object, but not any other data it may contain. This is crucial for parallelism, since we can statically know that one system updating all positions of all live objects can run at the same time as a different system rendering them all, for example, but more on this later once we talk about parallelism (once that's implemented). The other reason, which is more important now, is that the required data forms a *contract* to the object. If the object does not include the data components the func component requires then we get a compile error. Here is an example of just that:

```ft
use Core.print

data Transform:
	i32x2 pos;
	i32x2 size;
	Transform(pos, size);

data Scale:
	f32x2 scale;
	Scale(scale);

func FMove requires(Transform t, Scale s):
	def print():
		print($"pos: {t.pos}, size: {t.size}, scale: {s.scale}\n");

	def get_pos() -> i32x2:
		return t.pos;

object Object:
	data: Transform;
	func: FMove;
	Object(Transform);

def main():
	o := Object(Transform(i32x2(100, 120), i32x2(200, 220)));
	o.print();
	print($"o.pos = {o.get_pos()}\n");
```

This program prints this compile error:

> ```
> Parse Error at main.ft:19:1
> └──┬┤E0000│
> 19 │ object Object:
> ┌──┴─┘
> └─ Object type is missing data 'Scale' required by func component 'FMove'
> ```

In this example we added the `Scale` data requirement to the `FMove` func component and the object which includes it now needs to be updated to also include the new data component that func component requires. To fix this problem we need to add the data type to the object definition and to its constructor:

```ft
use Core.print

data Transform:
	i32x2 pos;
	i32x2 size;
	Transform(pos, size);

data Scale:
	f32x2 scale;
	Scale(scale);

func FMove requires(Transform t, Scale s):
	def print():
		print($"pos: {t.pos}, size: {t.size}, scale: {s.scale}\n");

	def get_pos() -> i32x2:
		return t.pos;

object Object:
	data: Transform, Scale;
	func: FMove;
	Object(Transform, Scale);

def main():
	o := Object(Transform(i32x2(100, 120), i32x2(200, 220)), Scale(f32x2(3.3, 4.4)));
	o.print();
	print($"o.pos = {o.get_pos()}\n");
```

And now this program prints these lines to the console:

> ```
> pos: (100, 120), size: (200, 220), scale: (3.3, 4.4)
> o.pos = (100, 120)
> ```

As you can see, the explicit requirements of func modules are our friend here.
