# Objects

Objects are a central part of Flint's desgin. As you know from the introduction, Flint is focsed on **composition** oppose to **inhertiance**. If it helps you, you can think of an `object` similar to what an class or object in other OOP languages is minus inheritance. So, when programming Flint**remove** inheritance from your mind. There is and never will be any form of inheritance in Flint.

You may need to adjust your brain a bit to stop thinking in *is-a* relationships (hierachical inheritance trees) and you need to start thinking in *has-a* relationships (object X *has* data Y and *has* capability Z). In Flint, and in compositional systems in general, we are not so much interested in what something **is**, we are more interested in **what can it do**. Once you internalize this fact, the rest of the design should be simple to learn and understand.

In this chapter we will start with something which should look the most familiar to you if you come from an inheritance-based world and mindset and we slowly move more and more towards a compositional mindset.
