# Introduction

This is the Flint Wiki. You will find any information regarding Flint in this Wiki. It's primary focus is to teach how to program in Flint and how Flint operates under the hood. All features of Flint are explained in-depth in this Wiki. All chapters are structured in a way where later chapters build on the knowledge of earlier chapters, so you will have the best learning experience with Flint if you follow the guides closely front to back.

Flint is a high-level language which aims at being fully transparent. This full transparency comes with a few trade-offs. First of all, Flint will never feel as high level as a language like Python does, for example. Expect that Flint will often times *feel* a bit lower level, while never actually being a low level language. Flint often times is more explicit than you might know it from other high level languages. But the thing you gain for that is very big and substantial: You actually can tell what the runtime is doing and what happens under the hood with ease.

Flint, as you will see, is quite different from most languages. In order to achieve *both* being high level *and* transparent it did not shy away from questioning the status-quo and invent it's own solutions if needed. A great example of this is its core paradigm. Flint is based on the **Declarative Composable Modules Paradigm** - an ECS-inspired model where data is separated from behaviour and then composed deterministically into class-like entities. Think of it as a cool mix of OOP and ECS.

Because of the transparency, Flint is also very shallow in it's abstractions. The more complex a system becomes the harder it is to make it transparent, and the simpler a system and it's rules become it becomes easier to look through. Flint is opinionated and is not for everyone, it might be too high or too low level for you, and that's okay. But if you want to write expressive high-level code and still know exactly what the runtime is doing, Flint might be just the language for you!

The goal of Flint is to write fast, ergonomic and predictable code without hidden complexity.
