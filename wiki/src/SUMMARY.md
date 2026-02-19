# Summary

[Introduction](./introduction.md)

# User Guide

- [Setup](./user_guide/setup.md)
  - [Installation](./user_guide/setup/1_installation.md)
  - [Syntax Highlighting](./user_guide/setup/2_syntax_highlighting.md)
  - [Language Server Setup](./user_guide/setup/3_fls_setup.md)
  - [FIP Setup](./user_guide/setup/4_fip_setup.md)

# Learning Flint

- [From Beginner to Intermediate](./beginners_guide.md)

  - [Basics](./beginners_guide/1_basics.md)

    - [The Hello World Program](./beginners_guide/1_basics/1_program.md)
    - [Compiling the Program](./beginners_guide/1_basics/2_compiling.md)
    - [Comments in Flint](./beginners_guide/1_basics/3_comments.md)
    - [Indentation in Flint](./beginners_guide/1_basics/4_indentation.md)

  - [Variables and Types](./beginners_guide/2_variables_and_types.md)

    - [Primitive Types](./beginners_guide/2_variables_and_types/1_primitive_types.md)
    - [Variables](./beginners_guide/2_variables_and_types/2_variables.md)
    - [Inferred Typing](./beginners_guide/2_variables_and_types/3_inferred_typing.md)
    - [Operators](./beginners_guide/2_variables_and_types/4_operators.md)
    - [Type Casting](./beginners_guide/2_variables_and_types/5_typecasting.md)
    - [String Interpolation](./beginners_guide/2_variables_and_types/6_string_interpolation.md)

  - [Control Flow](./beginners_guide/3_control_flow.md)

    - [The bool Type](./beginners_guide/3_control_flow/1_the_bool_type.md)
    - [Boolean Operations](./beginners_guide/3_control_flow/2_boolean_operations.md)
    - [Branching](./beginners_guide/3_control_flow/3_branching.md)
    - [Loops](./beginners_guide/3_control_flow/4_loops.md)
    - [Enums](./beginners_guide/3_control_flow/5_enums.md)
    - [Switch](./beginners_guide/3_control_flow/6_switch.md)

  - [Functions](./beginners_guide/4_functions.md)

    - [What is a Function?](./beginners_guide/4_functions/1_what_is_a_function.md)
    - [Adding Parameters](./beginners_guide/4_functions/2_adding_parameters.md)
    - [Returning Values](./beginners_guide/4_functions/3_returning_values.md)
    - [Recursion](./beginners_guide/4_functions/4_recursion.md)
    - [Returning Multiple Values](./beginners_guide/4_functions/5_returning_multiple_values.md)
    - [Groups](./beginners_guide/4_functions/6_groups.md)
    - [Tests](./beginners_guide/4_functions/7_tests.md)
    - [Annotations](./beginners_guide/4_functions/8_annotations.md)

  - [Data: The Core of Flint](./beginners_guide/5_data.md)

    - [Declaring Data Modules](./beginners_guide/5_data/1_declaring_data_modules.md)
    - [Default Values](./beginners_guide/5_data/2_default_values.md)
    - [Nested Data](./beginners_guide/5_data/3_nested_data.md)
    - [Using Data in Functions](./beginners_guide/5_data/4_using_data_in_functions.md)
    - [Tuples](./beginners_guide/5_data/5_tuples.md)
    - [Multi-Types](./beginners_guide/5_data/6_multi_types.md)
    - [Groups 2](./beginners_guide/5_data/7_groups_2.md)
    - [Type Aliasing](./beginners_guide/5_data/8_type_aliasing.md)

  - [Arrays & Ranges](./beginners_guide/6_arrays.md)

    - [Introduction to Arrays](./beginners_guide/6_arrays/1_introduction.md)
    - [Iterating Over Arrays](./beginners_guide/6_arrays/2_iterating_over_arrays.md)
    - [Strings](./beginners_guide/6_arrays/3_strings.md)
    - [Multidimensional Arrays](./beginners_guide/6_arrays/4_multidimensional_arrays.md)
    - [Enhanced for Loop](./beginners_guide/6_arrays/5_enhanced_for_loop.md)
    - [CLI Arguments](./beginners_guide/6_arrays/6_cli_arguments.md)
    - [Ranges](./beginners_guide/6_arrays/7_ranges.md)
    - [Access Patterns](./beginners_guide/6_arrays/8_access_patterns.md)
    - [Multidimensional Access Patterns](./beginners_guide/6_arrays/9_multidimensional_access_patterns.md)

  - [Imports](./beginners_guide/7_imports.md)

    - [The `use` Clausel](./beginners_guide/7_imports/1_the_use_clausel.md)
    - [Circular Dependencies](./beginners_guide/7_imports/2_circular_dependencies.md)
    - [Import Aliasing](./beginners_guide/7_imports/3_import_aliasing.md)
    - [Namespaces](./beginners_guide/7_imports/4_namespaces.md)
    - [Relative Paths](./beginners_guide/7_imports/5_relative_paths.md)

  - [Core Modules](./beginners_guide/8_core_modules.md)

    - [print](./beginners_guide/8_core_modules/1_print.md)
    - [read](./beginners_guide/8_core_modules/2_read.md)
    - [assert](./beginners_guide/8_core_modules/3_assert.md)
    - [filesystem](./beginners_guide/8_core_modules/4_filesystem.md)
    - [env](./beginners_guide/8_core_modules/5_env.md)
    - [system](./beginners_guide/8_core_modules/6_system.md)
    - [math](./beginners_guide/8_core_modules/7_math.md)
    - [parse](./beginners_guide/8_core_modules/8_parse.md)
    - [time](./beginners_guide/8_core_modules/9_time.md)
    - [random]()
    - [parallel]()

  - [Entities & Func modules](./beginners_guide/9_entities.md)

    - [Func Modules](./beginners_guide/9_entities/1_func_modules.md)
    - [Entities](./beginners_guide/9_entities/2_entities.md)
    - [Composition](./beginners_guide/9_entities/3_composition.md)
    - [Extending Entities](./beginners_guide/9_entities/4_extending_entities.md)
    - [Monolithic Entities]()
    - [Interfaces]()

  - [Links & Hooks]()

  - [Interop](./beginners_guide/11_interop.md)

    - [Introduction](./beginners_guide/11_interop/1_introduction.md)
    - [Defining External Functions](./beginners_guide/11_interop/2_defining.md)
    - [Interop Modules](./beginners_guide/11_interop/3_modules.md)
    - [Signatures](./beginners_guide/11_interop/4_signatures.md)
    - [Pointer Types](./beginners_guide/11_interop/5_pointers.md)
    - [`extern` vs `export`]()

  - [Game Example]()

    - [Introduction]()
    - [Using raylib]()

- [From Intermediate to Expert](./intermediates_guide.md)

  - [Optionals](./intermediates_guide/1_optionals.md)

    - [Introduction](./intermediates_guide/1_optionals/1_introduction.md)
    - [Unwrapping](./intermediates_guide/1_optionals/2_unwrapping.md)
    - [Comparing Optionals](./intermediates_guide/1_optionals/3_comparing_optionals.md)
    - [Null Coalescing Operator](./intermediates_guide/1_optionals/4_null_coalescing.md)
    - [Switching on Optionals](./intermediates_guide/1_optionals/5_optional_switch.md)
    - [Optional Chaining](./intermediates_guide/1_optionals/6_optional_chaining.md)
    - [Optionals as References](./intermediates_guide/1_optionals/7_references.md)
    - [List Example](./intermediates_guide/1_optionals/8_list.md)

  - [Variants](./intermediates_guide/2_variants.md)

    - [Introduction](./intermediates_guide/2_variants/1_introduction.md)
    - [Switching on Variants](./intermediates_guide/2_variants/2_variant_switch.md)
    - [Tagged Variants](./intermediates_guide/2_variants/3_tagged.md)
    - [Inline Variants](./intermediates_guide/2_variants/4_inline_variants.md)
    - [Variant Comparison](./intermediates_guide/2_variants/5_comparison.md)
    - [Unwrapping Variants](./intermediates_guide/2_variants/6_unwrapping.md)
    - [Variant Extraction](./intermediates_guide/2_variants/7_extraction.md)
    - [Optional Variants]()

  - [Error Sets](./intermediates_guide/3_error_sets.md)

    - [Introduction](./intermediates_guide/3_error_sets/1_introduction.md)
    - [Error Set Refinement](./intermediates_guide/3_error_sets/2_refinement.md)
    - [Function Signatures](./intermediates_guide/3_error_sets/3_signatures.md)
    - [The Error Structure](./intermediates_guide/3_error_sets/4_structure.md)
    - [Error Context](./intermediates_guide/3_error_sets/5_context.md)
    - [Throwing Anonymous Errors](./intermediates_guide/3_error_sets/6_anonymous.md)
    - [Internals](./intermediates_guide/3_error_sets/7_internals.md)
    - [Best Practices](./intermediates_guide/3_error_sets/8_best_practices.md)
    - [Error Switch Inlining](./intermediates_guide/3_error_sets/9_inlining.md)
    - [Inferring the Error Variant](./intermediates_guide/3_error_sets/10_inferring.md)
    - [Linearization]()

  - [Callables & Variable Persistence]()

    - [Introduction]()
    - [The `fn` Type]()
    - [Argument Binding]()
    - [Persistence]()
    - [Callbacks]()
    - [Event Systems]()
    - [Higher order Functions]()
    - [Introduction to the Thread Stack]()
    - [The 5 Call Steps]()
    - [Performance Optimization]()

  - [Pipes]()

    - [Introduction]()
    - [Chaining Operations]()
    - [Composing Functions]()

  - [Blueprints]()

    - [Introduction]()
    - [The `bp` Type]()
    - [Linearization]()
    - [fn Implications]()
    - [Higher order Functions]()
    - [The Eval Function]()
    - [Performance Implications]()

  - [Compile-Time Evaluation]()

  - [Generics]()

  - [Generic Library Example]()

- [From Expert to Master]()

  - [Paralellism]()

    - [How DOCP makes parallelism trivial]()
    - [The `parallel` Core module]()

  - [Concurrency & shared data]()

    - [Understanding Concurrency]()
    - [Spawning Threads]()
    - [Syncronizing Threads]()
    - [Locking Resources]()
    - [The Thread Stack]()
    - [Threading Internals]()
    - [Shared Data]()
    - [Annotations]()

  - [Async Compute]()

  - [FIP Internals & IM authoring]()

  - [DIMA Internals]()

    - [Slots]()
    - [Blocks]()
    - [Heads]()
    - [Defragmentation]()
    - [Slot Pinning]()
    - [Annotations]()

  - [DOCP Internals]()

    - [Compile-Time Dispatch Tables]()
    - [Entity Call Dispatch]()
