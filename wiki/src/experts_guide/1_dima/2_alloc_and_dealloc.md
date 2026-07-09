# Allocation & Deallocation

Now that you know the basic structures, lets go through the entire process of how allocation and deallocation works. Again, if you are proficient in the C programming language, I would recommend looking at the [dima.h](https://github.com/flint-lang/dima/blob/main/dima-c/dima.h) file directly.

When we write a line like

```ft
MyData d = MyData(10, 20);
```

in Flint, where `MyData` is a `data` type, several things happen under the hood. First of all, the `allocate` function is called which roughly looks like this:

```c
void *allocate(head_t **head_ref) {
    head_t *head = *head_ref;
    slot_t *slot = NULL;
    if (head->block_count == 0) {
        // Create initial block
        create_block();
        allocate_in_block();
    } else {
        // Try to find empty slot in all blocks
        for (size_t i = 0; i < head->block_count; i++) {
            // If empty slot is found, set slot pointer
            slot = ...;
        }
        if (slot == NULL) {
            // See if there is an empty block within the blocks array, allocate new block there
            for (size_t i = 0; i < head->block_count; i++) {
                // If empty block (NULL block) is found, create it and set slot
                create_block();
                allocate_in_block();
                slot = ...;
            }
        }
        if (slot == NULL) {
            // If no empty slot found, create new block and reallocate the head
            create_block();
            allocate_in_block();
            slot = ...;
        }
    }
    // Copy default value into slot, return pointer to slot
    memcpy(..);
    return slot->value;
}
```

This call returns a pointer into the newly allocated to the slot itself. The pointer returned from the `allocate` function does not point to the slot directly, but it points to the `value` of the slot, e.g. it's a direct value pointer. So, in the case of allocating a value of type `MyData`, the newly allocated value can directly be accessed via this pointer.

Since Memory management is ARC-based (or better said RC-based), we need to call `retain` when passing a value to a function and `release` after the function call. The `retain` function is dead simple, it just does a negative fixed pointer offset from the value pointer and then increments the `arc` field.

```c
void retain(void *value) {
    slot_t *slot = container_of(value, slot_t, value);
    slot->arc++;
}
```

The `release` function is a bit more complicated. It starts off as simple as the `retain` function, by just decrementing the `arc` but it also needs to handle the case when the `arc` reaches `0`:

```c
void release(head_t **head_ref, void *value) {
    slot_t *slot = container_of(value, slot_t, value);
    assert(slot->arc > 0);
    slot->arc--;
    if (LIKELY(slot->arc > 0)) {
        // Do not apply all the below checks since no block is potentially freed
        return;
    }
    // Decrement `used` count in block the slot is in
    block->used--;
    // Fill the slot with zeroes
    memset(...);
    // Do some pointer arithmetic to check whether this slot is "in front"
    // of the first free slot, in that case change the new first free slot to be this slot
    if (block->first_free_slot_id > index) {
        block->first_free_slot_id = index;
    }
    // Check if there are still values in the block, do nothing
    if (LIKELY(block->used > 0)) {
        return;
    }
    // Remove empty block
    free(block);
    // Shrink the blocks array if the last block was freed up to the first block thats not null
    if (LIKELY(block_id + 1 < head->block_count)) {
        return;
    }

    // Check how many empty blocks there are to calculate the new size
    // (to remove all trailing empty (NULL) blocks)
    size_t new_size = head->block_count - 1;
    for (; new_size > 0; new_size--) {
        if (head->blocks[new_size - 1] != NULL) {
            break;
        }
    }

    // Realloc the head to the new size
    head = realloc(...);
    *head_ref = head;
    head->block_count = new_size;
}
```

And this is basically the entire allocation and deallocation story. We create new values by (internally) calling `allocate`, increment the arc before passing a value to a function using `retain` and decrement the arc after a function call or when a value goes out of scope using `release`. DIMA really isn't something super special nor complicated at its core, and this should stay like that.
