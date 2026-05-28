# Linking Entity Functions

When linking functions in an entity coming from func-modules, you can also target an entity function as the "target" of a link. Lets look at the previous example first, but now re-written using purely entity-functions as targets to the links:

```ft
use Core.print

const data Constants:
	float PI = 3.14159265358979323846;

// A shape can be drawn and its area can be calculated
func IShape:
	def draw();
	def area() -> i32;


data DCircle:
	i32x2 pos;
	i32 radius;
	DCircle(pos, radius);

entity Circle:
	data: DCircle d;
	func: IShape;
	link:
		IShape::draw -> Circle::draw,
		IShape::area -> Circle::area;
	Circle(d);
	
	def draw():
		print($"Drawing circle at [pos={d.pos}, r={d.radius}]\n");

	def area() -> i32:
		return i32(Constants.PI * f32(d.radius ** 2));


data DRectangle:
	i32x2 pos;
	i32x2 size;
	DRectangle(pos, size);

entity Rectangle:
	data: DRectangle d;
	func: IShape;
	link:
		IShape::draw -> Rectangle::draw,
		IShape::area -> Rectangle::area;
	Rectangle(d);

	def draw():
		print($"Drawing rectangle at [pos={d.pos}, width={d.size.x}, height={d.size.y}\n");

	def area() -> i32:
		return d.size.x * d.size.y;


def draw_shapes(mut IShape[] shapes):
	for (_, s) in shapes:
		s.draw();

def sum_areas_of_shapes(mut IShape[] shapes) -> i32:
	i32 sum = 0;
	for (i, s) in shapes:
		i32 area = s.area();
		print($"shapes[{i}].area() = {area}\n");
		sum += area;
	return sum;

def main():
	IShape[] shapes = IShape[4](Circle(DCircle((11, 2), 5)));
	shapes[1] = Rectangle(DRectangle((10, 20), (4, 5)));
	shapes[2] = Circle(DCircle((3, 5), 10));
	shapes[3] = Rectangle(DRectangle((0, 0), (4, 2)));

	draw_shapes(shapes);
	print("\n");
	i32 sum = sum_areas_of_shapes(shapes);
	print($"sum of areas = {sum}\n");
```

This program will print these lines to the console:

> ```
> Drawing circle at [pos=(11, 2), r=5]
> Drawing rectangle at [pos=(10, 20), width=4, height=5
> Drawing circle at [pos=(3, 5), r=10]
> Drawing rectangle at [pos=(0, 0), width=4, height=2
>
> shapes[0].area() = 78
> shapes[1].area() = 20
> shapes[2].area() = 314
> shapes[3].area() = 8
> sum of areas = 420
> ```

As you can see, we have removed the `FCircle` and `FRectangle` func module types entirely and put the implementations of the functions into the entity itself. This makes sense for such small entity types like the one shown above. Of course, as the type grows in size with more data and func modules being added, linking to entity functions will become less and less attractive. The same rules apply here like for "regular" linking, namely the explicit parameter list and return types must match and the function names must match.

There exists one additional rule when linking entity functions, though: An entity function is only allowed to be the **target** of a link, but it is not allowed to be the **source** of a link!
This rule is self-explainatory if you think about it for a second. If you create a function within an entity and then link that function to a different function coming from a func module, then why did you create the entity function in the first place? Just remove it entirely and use the function of the func-module directly!
