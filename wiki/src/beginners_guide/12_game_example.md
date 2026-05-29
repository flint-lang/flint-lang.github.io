# Game Example

Welcome to the last chapter of the beginners guide! You have learnt a lot of Flint concepts in small examples over the coarse of this guide so far. Now we will move on to bring all those features together to create a small game using Flint. The small game we will create is [Pong](https://en.wikipedia.org/wiki/Pong).

This whole chapter is *not* mandatory for you to learn Flint, as no new concepts will be introduced. This chapters only purpose is to apply all concepts learnt up until this point in a meaningful way. Applying the concepts in a practical example will help you to consolidate them. So, even if you feel proficient in Flint, it is still recommended to follow this game example chapter before moving on to the intermediates guide.

![Finished Game Example](../images/finished_game_example.png)

We will create the game using [raylib](https://www.raylib.com), a C library which makes creating games very easy. This guide goes through the entire process of creating such a small game step by step. You don't need any prior knowledge in raylib or game developement in general, everything you need will be explained as you go.

**WARNING**:
Because of recent discoveries of FIP auto-bindgen not being 100% correct (quite a few of struct types and functions of raylib are missing), this chapter will not be finished in this release, but in the next one it will. These changes / additions to the FIP and the `fip-c` interop module will be implemented in `0.4.0`.
