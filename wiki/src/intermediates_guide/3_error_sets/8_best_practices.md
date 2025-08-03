# Best Practices

Let's discuss best practices regarding error handling in Flint next.

## Naming

Let's start with naming and with how Flint names it's errors internally. All Errors inside Flint start with `Err...` followed by the actual are of error, like `ErrNetwork`, `ErrSystem`, `ErrAssert`, `ErrEnv`, `ErrFS` and so on. Then, unlike enums where the values are prefered to be written in `SCREAMING_SNAKE_CASE`, the error values are written in `PascalCase`, just like errors. Also, error values may not start with the `Error` prefix, as this is handled by the `Err` prefix on the error set type. So you would end up writing `ErrName.ValueName` instead of `Something.ErrorName`. This recommendation exists to prevent collisions with other definitions, as there exist quite a few of definitions in Flint: `data`, `enum`, `variant`, `func`, `entity` and `error`. So, having clear naming for all of them keeps your code visually pleasing and easy to follow.

## Throwing Errors and Signatures

With great power comes great responsibility. With the power of extending error sets also come unique challenges not found in other languages. Here is an example of a 4-deep error set extension chain:

```rs
error ErrBase:
	Critical, Abortion;

error ErrParsing(ErrBase):
	UnexpectedToken, MissingToken, DuplicateDefinition;

error ErrStatement(ErrParsing):
	MissingSemicolon, EmptyScope, TypeMismatch;

error ErrExpression(ErrStatement):
	MissingOperator, UnknownType;


def parse_expression() {ErrExpression}:
	// Do some work and possibly throw an ErrExpression
	// This means it could be *any* from the above errors
	// because they all end up in the 'ErrExpression' set

def parse_statement() {ErrStatement}:
	parse_expression() catch err:
		ErrExpression(e):
			// Handle all expression-specific errors
			switch e:
				MissingOperator: // handle case
				UnknownType:     // handle case
				else:
					// The rest are all errors from base error sets
					// This means that we simply "recast" the error
					// and return it as a statement error
					ErrStatement es = e;
					throw es;
		// Just rethrow any other errors
		anyerror(e): throw e;

def parse_file() {ErrParsing}:
	parse_expression() catch err:
		ErrStatement(e):
			// Handle all statement-specific errors
			switch e:
				MissingSemicolon: // handle case
				EmptyScope:       // handle case
				TypeMismatch:     // handle case
				else:
					// The rest are all errors from base error sets
					// This means that we simply "recast" the error
					// and return it as a parsing error
					ErrParsing ep = e;
					throw ep;
		// Just rethrow any other errors
		anyerror(e): throw e;

def main():
	parse_file() catch err:
		// Now we can handle the parsing and check for all potential 
		// general parsing errors.
```

This is what I would consider a true "separation of concerns". Through the error set extension system we not only are able to specialize our errors but also keep the actual handling of those errors to higher levels while only focusing on the lower levels for the specialized sets. This is still a quite simple example. Just imagine having a dozen error set types where the most special error would have a hundred possible values it could be. Imagine writing a 100-branch switch in the specialized function, a 80 branch switch in the one above etc. That would be insane... this is why I would consider it best practice to keep only handling the "added" special errors in the error set at the deepest level, and just re-throwing the error as the more general value if it is not any of the specialized ones, because in that case it is *guaranteed* to be a value from the base sets instead.

There does not exist a way to make this all safe, though. Because if you would now add a new error to the error set `ErrExpression` for example you would not get a compiler error that you have not checked for that value in the switch, and the branch where you try to cast the error value to the base set type would be executed. As "workaroun" (or actual solution, we will see), casting a specialized error to it's base error while that specialized value holds an actual value greater than it's base type's capacity will crash the program loud and clear. We know at compile-time how big the set `ErrStatement` is, for example. It's exactly `8` values big currently. So, if we would try to cast a value with a `value_id >= 8` to that type it would just crash. It will be just a simple condition under the hood, but this condition prevents errors bubbling up to the main level (which would crash the program annyway most of times).
