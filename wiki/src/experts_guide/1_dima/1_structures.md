# Structures

Here are all structures explained which are part of DIMA. There are only three structures involved: The `Head`, the `Block` and the `Slot`.

## Head

Lets start at the `Head` structure. This structure is like a "type header". It contains the pointers to all allocated `Block`s and roughly looks like this:

```c
typedef struct head_t {
    const void *default_value;
    size_t type_size;
    size_t block_count;
    block_t *blocks[];
} head_t;
```

Every type, for example if we define a `data` or `entity` type, has a global variable pointing at its respective head:

```c
head_t *<HASH>.dima.head.data.MyDataType = ...;
head_t *<HASH>.dima.head.entity.MyEntityType = ...;
```

These global variables really have these dotted names as their symbols, in llvm IR code you can define symbols with a dot in them. So, but lets look at what each DIMA head contains:

- `default_value`: A pointer to the default-value of the type, when allocating a new `Slot` (will be described later) this default value is copied into it
- `type_size`: The size of the `data` or `entity` type stored in each `Slot`
- `block_count`: How many active blocks are allocated in the variable `blocks` member
- `blocks`: A variable member which contains pointers to all blocks allocated for this given head

The head essentially provides a stable "entry point" from which allocations or deallocations are dispatched. You can see it as the "root" of the DIMA tree. from which all instances of this type are reachable. The global variable needs to be a pointer because the pointers to the blocks are stored as a variable member of the struct itself, so we need to `realloc` the entire structure if a new block is created.

## Block

A `Block` was briefly explained in the introduction already. A `Block` is just a collection of `Slot`s, where each slot represents a single instance of the given type being allocated. The structure of a block looks like this:

```c
typedef struct block_t {
    size_t type_size;
    size_t capacity;
    size_t used;
    size_t pinned_count;
    size_t first_free_slot_id;
    slot_t slots[];
} block_t;
```

As you can see, it again has the `slots` directly stored in-line as a variable member. So, there is no pointer hopping to the "data" section of the block or something similar.

The fields of the block are all relatively simple:
- `type_size`: We need to store the size of the type (in bytes) in the block too, since there is no back-reference of the block back to the head, the type size is needed for indexing etc
- `capacity`: How many slots this block can fit, e.g. how many slots have been allocated in the `slots` member
- `used`: How many slots of this block are already occupied and in active usage (This is to make searching for free slots faster, as it becomes a simple comparison of the capacity with the usage)
- `pinned_count`: How many slots within this block are pineed (needed for the defragmentation algorithm, explained later)
- `first_free_slot_id`: The index of the first free slot in `slots`. This makes allocation speed *dramatically* faster, essentially `O(1)` in most scenarios
- `slots`: The actual slots this block contains, stored inline in the block structure itself.

A `Block` is essentially just a container which holds a few of the allocated `Slot`s.

## Slot

Now we come to the fun part, the `Slot` itself. The slot contains a few of fields, as you are able to see. This means that every single instance of `data` or `entity` has some allocation overhead in Flint, more specifically `16 Bytes`.

```c
typedef struct slot_t {
    void *owner;
    uint32_t arc;
    uint16_t block_id;
    slot_flags_t flags;
    char value[];
} slot_t;
```

Lets go through all the fields of a slot:
- `owner`: A pointer to the owner of this slot, this is needed information for the defragmentation algorithm
- `arc`: The reference count. As you can see, it's not an atomic reference count really. First of all, Flint has no support for mutli-threading yet, and second of all, thanks to the Thread Stack, it is impossible for two threads to point to the same DIMA slot, ever, so this reference count does not need to be atomic at all
- `block_id`: The index of the block this slot is contained in within the `Head`. This is needed for accessing the block (when freeing, for example)
- `flags`: Various flags describing this slot, as described below
- `value`: The actual data of the slot. This contains the actual allocated `data` / `entity` instance.

The `flags` is just a single byte enum value:

```c
enum {
    UNUSED = 0,
    OCCUPIED = 1,
    ARRAY_START = 2,
    ARRAY_MEMBER = 4,
    IS_ASYNC = 8,
    IS_ENTITY_OWNED = 16,
};
typedef uint8_t slot_flags_t;
```

By default, (when creating a new block) all slots within that block are zero-initialized which means that the `flags` is at `UNUSED` by default, meaning the slot is free and can be filled with a new instance.
