# Data

Flint is centered around composing reusable components into objects. The most basic and simple component is a `data` component. Since behaviour lives in a different component (or in free functions), `data` is just data in Flint, nothing more and nothing less. If you know other languages, then `data` is comparable to a `struct` or `record`. No functionality can be attached to data.

Data is used to "pack" values together and to make them reusable, just like functions made instructions and operations reusable, `data` modules make working with similar data much simpler.

Data, just like the `object` type (which will be introduced later) are the only types in Flint which are memory-managed by the DIMA (Deterministic Incremental Memory Architecture) memory system. It will be explained [way later](../experts_guide/1_dima.md) but if you are interested, feel free to read through it upfront (low level knowledge required).

But lets not focus on the theory so much but dive into declaring and using data right away.
