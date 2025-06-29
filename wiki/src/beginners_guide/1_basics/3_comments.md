# Comments in Flint

In Flint, comments are used to explain code or temporarily disable parts of it during debugging. Flint supports two types of comments:

1. **Single-line comments**: Start with // and continue until the end of the line.
2. **Multi-line comments**: Start with /* and end with */.

**Here’s how you use comments:**

```rs
use Core.print

def main():
    // This is a single-line comment explaining the print statement below
    print("Hello, Flint!\n");

    /*
     This is a multi-line comment.
     You can use it for detailed explanations
     or temporarily disabling multiple lines of code.
    */
    // print("This line is commented out and won't run.");
```

Comments are essential for writing clear, understandable, and maintainable code. Use them to explain your logic to others (or to yourself when revisiting code later).

Try to copy the code above into your `hello.ft` file and try to compile and run it.
