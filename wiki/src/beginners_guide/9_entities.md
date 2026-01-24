# Entities & Func modules

Entities in Flint are central to its philosophy of combining **data** and **behavior** in a modular and flexible way. They are similar to classes in object-oriented languages but follow Flint’s **Data-Object Convergence Paradigm (DOCP)**. Entities consist of **data modules** to store information and **func modules** to define behavior, providing a balance of structure and modularity.

Entities, unlike **Objects** (or **Classes**) in other languages, do not form inheritance-chains and are not runtime-evaluated. With Flint we simply asked the question: what if we would combine the best parts of **ECS** (**E**ntity **C**omponent **S**sytem) with the best parts of **OOP** (**O**bject-**O**riented **P**rogramming). The result was **DOCP**.

Throughout this section you will see a few similarities between DOCP and OOP or ECS but you will also see that it's neither of both but something of it's own. We are proud of the design of this paradigm, as it's the heart of Flint really.
