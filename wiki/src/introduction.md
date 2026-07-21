# Introduction

This is the Flint Wiki, it serves as the single source of truth for everything Flint-related. It's primary focus is to teach how to program in Flint and how Flint operates under the hood. All features of Flint are explained in-depth in this Wiki. All chapters are structured in a way where later chapters build on the knowledge of earlier chapters, so you will have the best learning experience with Flint if you follow the guides closely front to back.

This Wiki is split into a few sections:

- [1. Setup](./user_guide/setup.md): The basic setup, how to install Flint etc.
- [2. Quick Guide](./quick_guide.md): The quick guide assumes prior programming language in general. It is a condensed form of the three-part guide, where each chapter is broken down. It serves as a quick check to see if Flint even fits to the programming style of a developer in the first place.
- [3. From Beginner to Intermediate](./beginners_guide.md), [4. From Intermediate to Expert](./intermediates_guide.md) and [5. From Expert to Master](./experts_guide.md): This is a three-part guide which really goes in-depth about Flint. It does not assume any prior programming knowledge. For someone who already knows how to program, most information of these guides are redundant. However, these are the parts of the wiki where everything about Flint is documented.
- The Developer Guides [6. flintc](./developer_guide/flintc.md) and [7. fls](./developer_guide/fls.md) go in-depth on the implementation-side of things, how the compiler and the language server work etc. They are only meant for people who either want to contribute to Flint or are interested in how the compiler or language server work.

Flint is a high-level language which aims at being fully transparent. This full transparency comes with a few trade-offs. First of all, Flint will never feel as high level as a language like Python does, for example, since it then would need to hide too much from the developer. Flint is often more explicit than you might expect when coming from other high level languages. In exchange to this expliciteness you gain the ability to actually tell what the runtime is doing and what happens under the hood.

In order to achieve *both* being high level *and* transparent Flint did not shy away from questioning the status-quo and invent its own solutions if needed. As you will learn, these "inventions" are more often than not just well-known principles, but sometimes combined in new ways. A great example of this is its core paradigm. Flint is a composition-centric language where data is separated from behaviour and then composed deterministically into class-like objects. While it seems like good old composition at first glance, the fact that the entire language is built around this compositional approach results in some very neat static guarantees. (The largest advantages come in the areas of generics, type constraints, monomorphization and parallelism. But since these parts are not implemented yet, take this claim with a grain of salt.)

Because of the transparency, Flint needs to be shallow in it's abstractions. The more complex a system becomes the harder it is to make it transparent, and the simpler a system and its rules become it becomes easier to look through. Flint is opinionated and is not for everyone, it might be too high or too low level for you, and that's okay. But if you want to write expressive high-level code and still know exactly what the runtime is doing, Flint might be just the language for you!

The goal of Flint is to write fast, ergonomic and predictable code without hidden complexity.

