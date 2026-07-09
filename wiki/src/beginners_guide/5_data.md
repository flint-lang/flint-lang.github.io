# Data

Flint brings along a new paradigm called **Declarative Composable Modules Paradigm (DCMP)**. What this paradigm means and what it brings to the table will be discussed thoroughly in later chapters, but `data` is very important for it. Unlike other paradigms like OOP (Object-Oriented Programming) you cannot attach functions to data. In Flint, data is exactly just that: data. Nothing more, nothing less.

Data is used to "pack" values together and to make them reusable, just like functions made instructions and operations reusable, `data` modules make working with similar data much simpler.

Data, just like the `entity` type (which will be introduced later) are the only types in Flint which are memory-managed by the DIMA (Deterministic Incremental Memory Architecture) memory system. It will be explained [way later](../experts_guide/1_dima.md) but if you are interested, feel free to read through it upfront.

But lets not focus on the theory so much but dive into declaring and using data right away.
