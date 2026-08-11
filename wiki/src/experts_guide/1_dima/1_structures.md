# Structures

Here are all structures explained which are part of DIMA. There are only three structures involved: The `Head`, the `Block` and the `Slot`.

## Head

Lets start at the `Head` structure. This structure is like a "type header". It contains the pointers to all allocated `Block`s and looks like this:

```c
struct head_t {
    // A pointer to the default-value of the type, when allocating a new `Slot`
    // (will be described later) this default value is copied into it
    const void *default_value;

    // The size of the `data` or `entity` type stored in each `Slot`
    size_t type_size;

    // How many active blocks are allocated in the variable `blocks` member
    size_t block_count;

    // A variable member which contains pointers to all blocks allocated for
    // this given head
    struct block_t *blocks[];
};
```

Every type, for example if we define a `data` or `object` type, has a global variable pointing at its respective head:

```c
head_t *<HASH>.dima.head.data.MyDataType = ...;
head_t *<HASH>.dima.head.entity.MyObjectType = ...;
```

These global variables really have these dotted names as their symbols, in llvm IR code you can define symbols with a dot in them.

The head essentially provides a stable "entry point" from which allocations or deallocations are dispatched. You can see it as the "root" of the DIMA tree. from which all instances of this type are reachable. The global variable needs to be a pointer because the pointers to the blocks are stored as a variable member of the struct itself, so we need to `realloc` the entire structure if a new block is created.

## Block

A `Block` was briefly explained in the introduction already. A `Block` is just a collection of `Slot`s, where each slot represents a single instance of the given type being allocated. The structure of a block looks like this:

```c
struct block_t {
    // We need to store the size of the type (in bytes) in the block too, since
    // there is no back-reference of the block back to the head, the type size
    // is needed for indexing etc
    size_t type_size;

    // How many slots this block can fit, e.g. how many slots have been
    // allocated in the `slots` member
    size_t capacity;

    // How many slots of this block are already occupied and in active usage
    // (This is to make searching for free slots faster, as it becomes a simple
    // comparison of the capacity with the usage)
    size_t used;

    // How many slots within this block are pineed (needed for the
    // defragmentation algorithm, explained later)
    size_t pinned_count;

    // The index of the first free slot in `slots`. This makes allocation speed
    // *dramatically* faster, essentially `O(1)` in most scenarios
    size_t first_free_slot_id;

    // The actual slots this block contains, stored inline in the block
    // structure itself.
    struct slot_t slots[];
};
```

As you can see, it again has the `slots` directly stored in-line as a variable member. So, there is no pointer hopping to the "data" section of the block or something similar. A `Block` is essentially just a container which holds a bunch of the allocated `Slot`s.

## Slot

Now we come to the fun part, the `Slot` itself. The slot contains a few fields, as you are able to see. This means that every single instance of type `data` or `object` has some allocation overhead in Flint, more specifically `16 Bytes`.

```c
struct slot_t {
    // A pointer to the owner of this slot, this is needed information for the
    // defragmentation algorithm
    void *owner;

    // The reference count. As you can see, it's not an atomic reference count
    // really. First of all, Flint has no support for mutli-threading yet, and
    // second of all, thanks to the Thread Stack, it is impossible for two
    // threads to point to the same DIMA slot, ever, so this reference count
    // does not need to be atomic at all
    uint32_t arc;

    // The index of the block this slot is contained in within the `Head`.
    // This is needed for accessing the block (when freeing, for example)
    uint16_t block_id;

    // Various flags describing this slot, as described below
    enum slot_flags_t flags;

    // The actual data of the slot. This contains the actual allocated instance
    char value[];
};
```

The `flags` is just a single byte enum value:

```c
enum slot_flags_t : uint8_t {
    UNUSED = 0,
    OCCUPIED = 1,
    ARRAY_START = 2,
    ARRAY_MEMBER = 4,
    IS_ASYNC = 8,
    IS_OWNED_BY_OBJECT = 16,
};
```

By default, (when creating a new block) all slots within that block are zero-initialized which means that the `flags` is at `UNUSED` by default, meaning the slot is free and can be filled with a new instance.

<div class="warning">

Most flags are not used by the compiler yet.

Note that all flags other than `UNUSED` and `OCCUPIED` are not used by the compiler yet. It originally was planned to have arrays of data or objects like `MyData[]` allocated directly within DIMA, but it is uncertain whether this really will be implemented like that in the future at all.

</div>
