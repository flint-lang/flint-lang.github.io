# Composition

As you know, entities can incorporate multiple `data` and `func` modules, making them powerful abstractions for complex systems. So, let's talk a bit about the difference between composition and inheritance here. In an OOP-world, where classes inherit other classes you would get a **identity hierarchy** tree. In an OOP-world you are always asking what something *is*. *Is* this class, like `Dog` an `Animal`? OOP is filled with the question about identity, whether something *is* a specialization of something more general.

This question about identity helps in modelling *type relationships* of classes but it comes with a runtime-cost, casting specialized objects to more generous ones etc. In the world of composition you do not ask yourself what something *is* but rather what something *has*. You do not care about it's **identity**, you only care about it's **capabilities**. For example, in that previous example about animals, which is a *very* common OOP example, we would model it very differently in Flint using DOCP.

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

As you can see very clearly, we always ask about *identity* in OOP-languages, a `Dog` **is** an `Animal` and through this mindset of identity we always ask ourselves questions like "What does a Dog do what an Animal in general does not?", "What's something which *every* animal has and does?" or "Should we split it further into LandAnima, SeaAnimal etc?". As you can see easily the OOP world is full of questions, because *identity* is not as easy to grasp and model as it may seem at first sight. You often end up with over-abstracted systems just because you tried to be "correct" with your identities.

In the world of composition these questions do not disappear entirely, but you will start to gain a different mindset, and you will start to ask different questions, not related to *identity* but *capability*. For example instead of asking what an animal in general *is* you can just start modelling *capabilities* of animals in general. For example, an animal might be able to **swim**, it might be able to **dive**, it might be able to **fly**, it may be able to **run** or it might be able to **jump**. You start modelling all these capabilities and start questioning yourself: What **properties** does each of these capabilites need? To be able to **swim** you either need legs or fins, so it could depend, same for **dive**. But to be able to **fly** you *definitely* need `Wings`. To be able to run or jump you *definitely* need `Legs`. So in our example it may look like this:

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
	Legs(count, speed);

func Fly requires(Wings w):
	def fly():
		print($"Starting to fly for {w.flight_time} seconds with my {w.size}cm large wings\n");

func Run requires(Legs l):
	def run():
		print($"Starting to run with my {l.count} legs with a speed of {l.speed} km/h\n");

func Jump requires(Legs l):
	def jump():
		print($"Jumping {l.height}m high with my {l.count} legs\n");

entity Dog:
	data: Legs;
	func: Run, Jump;
	Dog(Legs);

entity Bird:
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

Yoou may be able to see that we now could add more and more capabilities to the system, like being able to make a sound, having claws, having sharp teeth, being able to eat plants or being able to eat meat. If an animal can eat both then it automatically becomes omnivorous. The more capabilities we add the easier it becomes to model different animals, since we can just re-use all of our already existing capabilities.

To think in terms of composition definitely requires a shift in mindset, if you try to model everyting the "OOP-way" in Flint you will find yourself hitting your head against a wall. Flint requires a different mindset when modelling your entities and if you can't gain this different midset then you will have a hard time with Flint. But if you are open to this new mindset i promise you that you will be able to enjoy Flint a lot, since this whole mindset makes it very easy to model and extend your already existing systems without refactoring it all, like you often times need in OOP when identities change.

I like OOP and i still think it has it's place. You may come across problems where DOCP just does not fit, and that's okay. Some problems requires hard identity-relationships and it's okay to use different languages for these sorts of problems. Flint is not a language that tries to be everything for everyone like C++ tries to be, and in my view that's a good thing.
