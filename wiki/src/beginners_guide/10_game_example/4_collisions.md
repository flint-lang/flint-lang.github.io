# Collision Detection

Next up is the ability to let the ball collide with the paddle and to then let it bounce off of it. The overall idea is that we wnat to check whether the ball "touches" the paddle and if it does we call `reflect_v` on the ball to change its movement direction. For this to work, we need to know about boththe paddle and the ball, so we create a new file, `collisions.ft` which will detect and handle all collisions between paddles and the ball.

**`collisions.ft`**:
```ft
use Core.print

use "ball.ft"
use "paddle.ft"

def check_collisions(mut Ball ball, FPaddleCommon paddle):
	if paddle.collides_with(ball):
		print("Collided with paddle!\n");
		ball.reflect_v();
```

The function `check_collisions` is very simple, it just takes a ball and a paddle, calls the `collides_with` function of the paddle and if it collided then it calls `reflect_v` on the ball.

The `collides_with` function, however, does not exist yet on the paddle. But before we can create it, we need to add the `get_radius`, `get_x` and `get_y` functions to the `Ball` object. We cannot access object data directly from outside, so we cannot write `ball.ball.pos.x` or `ball.ball.radius` etc directly. If we want to have access to object-local data, it needs to be returned by a function call, getters essentially. Those three functions are all very simple, and they do not modify the data so they can be const too:

```ft
	const def get_x() -> f32:
		return ball.pos.x;

	const def get_y() -> f32:
		return ball.pos.y;

	const def get_radius() -> f32:
		return ball.radius;
```

I like to define the getters before any other functions in an object (or func component), in our case we define them above the `draw` function. And now with these functions in place, we can finally implement the `collides_with` function in the `paddle.ft` file to check whether the paddle collided with a given ball:

```ft
	const def collides_with(Ball ball) -> bool:
		const bool below = ball.get_y() > paddle.pos.y + f32(paddle.size.y / 2) + ball.get_radius() / 2.0;
		const bool above = ball.get_y() < paddle.pos.y - f32(paddle.size.y / 2) - ball.get_radius() / 2.0;
		if below or above:
			return false;

		f32 x_paddle = paddle.pos.x;
		f32 x_ball = ball.get_x();
		if x_ball < x_paddle:
			x_ball += ball.get_radius();
			x_paddle -= f32(paddle.size.x / 2);
			return x_ball > x_paddle;
		else:
			x_ball -= ball.get_radius();
			x_paddle += f32(paddle.size.x / 2);
			return x_ball < x_paddle;
```

The first block simply checks whether the ball is above or below the paddle, in such a case we can never collide with it. Then we get the `x` positions of both the paddle and check whether we collided on the left or right side of the paddle. We essentially check whether the ball is "overlapping" with the rectangle left or right, that's all we do.

And now we have collisions in place. The ball now properly bounces off the paddle. Both the paddle and the ball are spawned at the same position, though, which leads to the ball being "stuck". You just need to move away from the ball so it can fly off.
