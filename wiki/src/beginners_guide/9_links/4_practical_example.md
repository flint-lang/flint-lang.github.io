# Practical Example

You might have been asking: "What do i even need links for?" until now, as this has not been covered yet. Lets look at a practical example utilizing lings, interfaces and polymorphism in a meaningful way:

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

func FCircle requires(DCircle d):
	def draw():
		print($"Drawing circle at [pos={d.pos}, r={d.radius}]\n");

	def area() -> i32:
		return i32(Constants.PI * f32(d.radius ** 2));

entity Circle:
	data: DCircle;
	func: IShape, FCircle;
	link:
		IShape::draw -> FCircle::draw,
		IShape::area -> FCircle::area;
	Circle(DCircle);


data DRectangle:
	i32x2 pos;
	i32x2 size;
	DRectangle(pos, size);

func FRectangle requires(DRectangle d):
	def draw():
		print($"Drawing rectangle at [pos={d.pos}, width={d.size.x}, height={d.size.y}\n");

	def area() -> i32:
		return d.size.x * d.size.y;

entity Rectangle:
	data: DRectangle;
	func: IShape, FRectangle;
	link:
		IShape::draw -> FRectangle::draw,
		IShape::area -> FRectangle::area;
	Rectangle(DRectangle);


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

As you can see, the `sum_areas_of_shape` and `draw_hsapes` functions know *nothing* about the entity types `Circle` or `Rectangle`. You could add new shapes, like triangles, quads etc and the functions still stay the same. Each entity type has its own implementations of the functions defined in the `IShape` interface, and the empty functions of the interface is linked to the implementation of the function.

I hope this example makes clear why `link`s even exist in Flint in the first place, and what they enable you to do.
