# Indentation in Flint

Flint enforces **strict indentation rules** to ensure clean and readable code. Only **hard tabs** (\t) are allowed for indentation. Each tab indicates a new level of nesting.

Let’s see why proper indentation is crucial:

```rs
def main():
print("This is not indented correctly.");
```

When you run the above code, you’ll see an error:

> Error: Indentation expected for block inside main().

This happens because Flint expects all code inside main to be indented. Here’s the correct way to write it:

```rs
def main():
	print("This is correctly indented."); // Properly indented with a hard tab
```

Use comments to explain your code and highlight mistakes. For example:

```rs
def main():
// The following line is not indented and will cause an error:
print("Oops, this won't work!");

// Uncomment the next line to fix the indentation:
	// print("Now it works!");
```

Proper indentation is not just a stylistic choice in Flint—it’s a fundamental part of the syntax. By using only hard tabs, Flint ensures consistency across projects.

---

Now you’re ready to move on to variables and types, where we’ll dive deeper into how to store and manipulate data!
