# time

```ft
use Core.time
```

The `time` module provides time-related functions and types used for profiling, time measurements and other time-related tasks.

| Function Name |     Parameter Types      | Return Types | Possible Errors |
| :-----------: | :----------------------: | :----------: | :-------------: |
|     `now`     |            No            |  `TimeStamp` |        No       |
|   `duration`  | `TimeStamp`, `TimeStamp` |  `Duration`  |        No       |
|   `as_unit`   |  `Duration`, `TimeUnit`  |    `f64`     |        No       |
|    `sleep`    |        `Duration`        |      No      |        No       |
|    `sleep`    |    `u64`, `TimeUnit`     |      No      |        No       |
|    `from`     |    `u64`, `TimeUnit`     |  `Duration`  |        No       |


## types

These are the types this Core module provides.

### TimeUnit

This enum is used to provide information in which unit a given time value is.

```ft
enum TimeUnit:
    NS, // Nanoseconds
    US, // Microseconds
    MS, // Milliseconds
    S;  // Seconds
```

### TimeStamp

A `TimeStamp` is a fixed point in time.

```ft
data TimeStamp:
    u64 value;
    TimeStamp(value);
```

The `value` of a time stamp is *always* in the highest resolution available. On Windows, where the minimal precision is most likely at 10 MHz or `100 ns`, the value will be in incremental steps of `100 ns` most likely. But as a general rule of thumb: do NOT assume ANY unit with the `value` value, since it's unit might very well change over time! A `TimeStamp` is unitless and could mean *anything*, it could even be the number of cycles counted on the CPU for example, so do not assume any unit with a timestamp, it should only be used as an abstract thing.

### Duration

A `Duration` is a time difference between two `TimeStamp`s.

```ft
data Duration:
    u64 value;
    Duration(value);
```

Like the `TimeStamp`, the `value` of the `Duration` is in the highest possible resolution, `ns`. Unlike the `TimeStamp` which is unitless and abstract, the `Duration` value will always have a unit of nanoseconds, so if you want to you can directly use the `duration.value` as a nanosecond value.

Because durations *always* have the unit of `ns` you can freely add and subtract durations from one another and create new durations this way:

```ft
Duration d1 = from(10, TimeUnit.MS);
Duration d2 = from(200, TimeUnit.US);
Duration d3 = Duration(d1.value + d2.value); // d3 is now 10.2 ms long
```

Keep in mind that for actually printing durations you should use the `as` function as described below.

## functions

These are the functions this Core module provides.

### now

The `now` function is used to get a `TimeStamp` of the current time of the system measured from it's uptime. A `TimeStamp` is unitless, as described earlier. The `TimeStamp` alone is not that useful without interpreting the difference in time stamps and interpreting them as a duration, though.

```ft
use Core.time

def slow_calculation() -> i32:
    i32 sum = 0;
    for i := 0; i < 1_000_000; i++:
        sum += 1;
    return sum;

def main():
    TimeStamp start = now();
    i32 result = slow_calculation();
    TimeStamp end = now();
```

This program will not print anything yet, to be able to use the `Duration` effectively we need the `duration` function.

### duration

The `duration` function is used to calculate a duration from two given `TimeStamp` values. The time stamps can be passed in in any order, so you could write `duration(end, start)` or `duration(start, end)`, the function will not fail but always return the time difference between the two time stamps.

```ft
use Core.print
use Core.time

def slow_calculation() -> i32:
    i32 sum = 0;
    for i := 0; i < 1_000_000; i++:
        sum += 1;
    return sum;

def main():
    TimeStamp start = now();
    i32 result = slow_calculation();
    TimeStamp end = now();

    Duration elapsed = duration(start, end);
    print($"Calculation took {elapsed.value} ns\n");
```

This program will print something like this to the console:

> ```
> Calculation took 233760 ns
> ```

### as_unit

The `as_unit` function is used to "cast" any given `Duration` to a given `TimeUnit`, the result is a `64 bit` floating point value. It is meant for displaying time, for example when displaying a duration as milliseconds then this function can be used. As a general rule of thumb: Always use the `as_unit` function to *display* durations but do not use the provided value for further calculations (because of floating point rounding erros and inprecision).

```ft
use Core.print
use Core.time

def slow_calculation() -> i32:
    i32 sum = 0;
    for i := 0; i < 1_000_000; i++:
        sum += 1;
    return sum;

def main():
    TimeStamp start = now();
    i32 result = slow_calculation();
    TimeStamp end = now();

    Duration elapsed = duration(start, end);
    print($"Calculation took {as_unit(elapsed, TimeUnit.MS)} ms\n");
```

This program will print something like this to the console:

> ```
> Calculation took 4.211604 ms
> ```

### sleep

The `sleep` function has two variations to it, but they both are used for the same thing: To let a thread sleep for a given amount of time. For example after sending a command to an external program we could sleep before checking if it has responded yet instead of constantly checking if it has responded. The `sleep` function is a way to do blocked waiting. If you are more interested in the difference of busy waiting and blocked waiting I recommend a look [here](https://stackoverflow.com/questions/26541119/whats-different-between-the-blocked-and-busy-waiting). It's a topic about threading and scheduling, so it will be the topic of a later chapter for sure.

It is also important to note that the precision of the `sleep` function is platform-dependent:
- Windows: ~1-15ms
- Linux / macOS: ~1µs - 100µs

For very short delays (< 1ms) the actual slept time might be longer than the requested time.

```ft
use Core.print
use Core.time

def main():
    TimeStamp start = now();
    sleep(100, TimeUnit.MS);
    TimeStamp end = now();

    Duration elapsed = duration(start, end);
    print($"Slept for {as_unit(elapsed, TimeUnit.MS)} ms\n");
```

This program will print something like this to the console:

> ```
> Slept for 100.081229 ms
> ```

Just like how we can call `sleep(100, TimeUnit.MS)` to sleep for 100 ms, we could also call `sleep(duration)` to call for a certain duration. But a duration can only be built from two `TimeStamp`s (or manually constructing int). The second variation of the `sleep` function is showcased in the `from` function's example.

### from

The `from` function is used to get a `Duration` *from* a given raw value + a `TimeUnit`. One could, in theory, calculate it directly too since the `Duration` is in the unit of `ns` internally anyway.

```ft
use Core.time

def do_operation():
    return;

def main():
    TimeStamp last_call = now();

    // Ensure minimum 100ms between calls
    while true:
        TimeStamp current = now();
        Duration elapsed = duration(last_call, current);

        if as_unit(elapsed, TimeUnit.MS) >= 100.0:
            do_operation();
            last_call = now();
```

This program will not print anything to the console, but it showcases an important concept: Executing things in roughly the fixed rate, in this case executing `do_operation` every 100 ms. This function actually checks the time over and over again in a busy loop. We could also make it waiting. We know that we want to execute it roughly all 100 ms so we *could* just sleep for 100ms after the operation too like so:

```ft
use Core.time

def do_operation():
    return;

def main():
    while true:
        do_operation();
        sleep(100, TimeUnit.MS);
```

This could work too, but now the thread is blocked, we are blocked waiting. If we would want to do other stuff while not calling `do_operation` (for example if the loop would be a lot longer with more time checks and more different functions and intervals) then the first example should be used.

