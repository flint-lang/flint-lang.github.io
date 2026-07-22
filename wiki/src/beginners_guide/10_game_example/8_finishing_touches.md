# Finishing Touches

There is essentially just one small finishing touch I would like to add. Currently it is impossible for the cpu to loose a game because it moves faster than the ball does. So, When the ball collides with a paddle, it should get faster:

```ft
	def reflect_v():
		ball.dir = ball.dir * (-1.0, 1.0);
		ball.speed *= 1.1;
```

Adding the `ball.speed *= 1.1;` to the `reflect_v` function of the `Ball` entity type in `ball.ft` is everything which needs to be done here.

## Next Steps

This tutorial now can be considered compelted. There exists one remaining problem, thoug. The sound abruptly stops mid-wave and the amplitude when stopping might not be 0. You could fix this yourself, if you want to, but I thought fixing this problem is too much for this small showcase. So, feel free to iterate on this small game and improve it if you want! Add a small win or loose sound like a "tada" when the player makes a point, or change other things, play around with it a bit, or build something entirely different using Flint.

## All Files

At the end, here are all the files of this project we ultimately ended up with.

### `main.ft`

```ft
use Core.time
use Core.print

use Fip.raylib as rl

use "audio.ft"
use "ball.ft"
use "collisions.ft"
use "colors.ft"
use "cpu.ft"
use "paddle.ft"
use "player.ft"

def reset_objects(mut Ball ball, mut IPaddle player, mut IPaddle cpu):
	ball.reset();
	player.reset();
	cpu.reset();

def main():
	// Screen setup
	i32x2 screen = (1280, 800);
	u32 flags = u32(rl.ConfigFlags.FLAG_WINDOW_RESIZABLE);
	flags += u32(rl.ConfigFlags.FLAG_VSYNC_HINT);
	rl.SetConfigFlags(flags);
	rl.InitWindow(screen.x, screen.y, "Pong");

	// Set up audio
	Audio a = init_audio();

	// Initialize game objects
	ball := Ball(DBall(_));
	player := Player(DPaddle(_));
	cpu := Cpu(DPaddle(_));
	reset_objects(ball, player, cpu);

	u32 player_score = 0;
	u32 cpu_score = 0;
	TimeStamp last_frame = now();
	while not rl.WindowShouldClose():
		screen = (rl.GetScreenWidth(), rl.GetScreenHeight());

		rl.BeginDrawing();

		// Draw the game board
		rl.ClearBackground(Colors.dark_green);
		rl.DrawRectangle(screen.x / 2, 0, screen.x / 2, screen.y, Colors.green);
		rl.DrawLine(screen.x / 2, 0, screen.x / 2, screen.y, Colors.white);
		rl.DrawCircle(screen.x / 2, screen.y / 2, 150.0, Colors.light_green);

		// Get the delta time
		TimeStamp current_frame = now();
		Duration frame_duration = duration(last_frame, current_frame);
		f32 delta = f32(as_unit(frame_duration, TimeUnit.S));
		last_frame = current_frame;

		// Update game objects
		a.update();
		ball.update(delta);
		player.update(delta);
		cpu.update(ball.get_y(), delta);

		// Check for collisions
		switch check_collisions(a, ball, player, cpu):
			RUNNING:
				break;
			P1_WON:
				print("p1 won\n");
				player_score++;
				reset_objects(ball, player, cpu);
			P2_WON:
				print("p2 won\n");
				cpu_score++;
				reset_objects(ball, player, cpu);

		// Draw the game objects
		ball.draw();
		player.draw();
		cpu.draw();

		// Draw UI
		rl.DrawText(str(player_score), screen.x / 4, 20, 60, Colors.white);
		rl.DrawText(str(cpu_score), (screen.x * 3) / 4, 20, 60, Colors.white);
		rl.EndDrawing();

	a.deinit();
	rl.CloseWindow();
```

### `audio.ft`

```ft
use Core.print
use Core.time
use Core.math

use Fip.raylib as rl

const data AudioConfig:
	int SAMPLE_RATE = 44100;
	int BUFFER_SIZE = 1024;
	float COLLISION_FREQUENCY = 220.0;

data DAudio:
	rl.AudioStream stream = rl.LoadAudioStream(u32(AudioConfig.SAMPLE_RATE), 32, 1);
	f32[] buffer = f32[AudioConfig.BUFFER_SIZE](0.0);
	f32 phase = 0.0;
	f32 frequency = 440.0;
	u32 total_frames = 0;
	u32 frames_written = 0;
	bool playing = false;
	DAudio(stream, buffer, phase, frequency, total_frames, frames_written, playing);

object Audio:
	data: DAudio a;
	Audio(a);

	def play(f32 freq, Duration duration):
		print($"audio play {freq}Hz for {as_unit(duration, TimeUnit.MS)}ms\n");
		a.frequency = freq;
		a.phase = 0.0;
		a.frames_written = 0;
		a.total_frames = u32(as_unit(duration, TimeUnit.S) * f32(AudioConfig.SAMPLE_RATE));
		a.playing = true;
		rl.PlayAudioStream(a.stream);

	def update():
		if not a.playing:
			return;
		if not rl.IsAudioStreamProcessed(a.stream):
			return;

		// Check if we are done playing the audio
		if a.frames_written >= a.total_frames:
			self.stop();
			return;

		// Calculate the number of remaining frames and set the chunk to either the
		// buffer size or the remaining, depending on what's smaller
		u32 remaining = a.total_frames - a.frames_written;
		u32 chunk = min(remaining, u32(AudioConfig.BUFFER_SIZE));

		// Calculate the phase step, it essentially is the radian "offset" between
		// each data point in the `buffer`
		f32 phase_step = 2.0 * 3.141592 * a.frequency / f32(AudioConfig.SAMPLE_RATE);

		// Calculate all amplitudes in the buffer using the `sin` function to get
		// a sine wave beep
		for (i, _) in 0..chunk:
			a.buffer[i] = sin(a.phase);
			a.phase += phase_step;

		// Pass the buffer to the audio stream function to tell raylib what to process next
		rl.UpdateAudioStream(a.stream, &a.buffer, i32(chunk));
		a.frames_written += chunk;

	def stop():
		a.playing = false;
		rl.StopAudioStream(a.stream);

	def deinit():
		rl.UnloadAudioStream(a.stream);
		rl.CloseAudioDevice();

def init_audio() -> Audio:
	print("init audio\n");
	rl.InitAudioDevice();
	rl.SetAudioStreamBufferSizeDefault(AudioConfig.BUFFER_SIZE);
	return Audio(DAudio(_));
```

### `ball.ft`

```ft
use Core.math

use Fip.raylib as rl

use "colors.ft"

data DBall:
	f32x2 pos = f32x2(0, 0);
	f32x2 dir = f32x2(0, 0);
	f32 speed = 0;
	f32 radius = 20;
	DBall(pos, dir, speed, radius);

object Ball:
	data: DBall ball;
	Ball(ball);

	const def get_x() -> f32:
		return ball.pos.x;

	const def get_y() -> f32:
		return ball.pos.y;

	const def get_radius() -> f32:
		return ball.radius;

	const def draw():
		rl.DrawCircle(i32(ball.pos.x), i32(ball.pos.y), ball.radius, Colors.yellow);

	def update(f32 delta):
		ball.pos += ball.dir * (delta * ball.speed);
		const bool bounce_top = ball.pos.y - ball.radius < 0 and ball.dir.y < 0;
		const bool bounce_bottom = ball.pos.y + ball.radius > f32(rl.GetScreenHeight()) and ball.dir.y > 0;
		if bounce_top or bounce_bottom:
			self.reflect_h();

	def reset():
		i32 angle_deg = rl.GetRandomValue(-40, 40);
		i32 left_or_right = rl.GetRandomValue(0, 1);
		angle_deg += 180 * left_or_right;
		const f32 pi = 3.141592;
		const f32 angle_rad = (f32(angle_deg) * pi) / 180.0;
		f32x2 ball_dir = (cos(angle_rad), sin(angle_rad));

		ball.speed = 400.0;
		ball.dir = ball_dir;
		ball.pos = f32x2(rl.GetScreenWidth() / 2, rl.GetScreenHeight() / 2);

	def reflect_v():
		ball.dir = ball.dir * (-1.0, 1.0);
		ball.speed *= 1.1;

	def reflect_h():
		ball.dir = ball.dir * (1.0, -1.0);
```

### `collisions.ft`

```ft
use Core.print
use Core.time

use "audio.ft"
use "ball.ft"
use "paddle.ft"

enum GameState:
	RUNNING, P1_WON, P2_WON;

def check_collisions(mut Audio a, mut Ball ball, IPaddle player, IPaddle cpu) -> GameState:
	// Check if the ball passed one of the players
	if cpu.ball_passed(ball):
		return GameState.P1_WON;
	if player.ball_passed(ball):
		return GameState.P2_WON;

	// Check for collisions of the ball with the cpu
	if cpu.collides_with(ball):
		print("Collided with P1!\n");
		ms_100 := from(100, TimeUnit.MS);
		a.play(AudioConfig.COLLISION_FREQUENCY, ms_100);
		ball.reflect_v();
		return GameState.RUNNING;

	// Check for collisions of the ball with the player
	if player.collides_with(ball):
		print("Collided with P2!\n");
		ms_100 := from(100, TimeUnit.MS);
		a.play(AudioConfig.COLLISION_FREQUENCY, ms_100);
		ball.reflect_v();
		return GameState.RUNNING;
	
	return GameState.RUNNING;
```

### `colors.ft`

```ft
use Fip.raylib as rl

const data Colors:
	rl.Color black = rl.Color(0, 0, 0, 255);
	rl.Color white = rl.Color(190, 190, 190, 255);
	rl.Color gray = rl.Color(100, 100, 100, 255);
	rl.Color green = rl.Color(38, 185, 154, 255);
	rl.Color dark_green = rl.Color(20, 160, 133, 255);
	rl.Color light_green = rl.Color(129, 204, 184, 255);
	rl.Color yellow = rl.Color(243, 213, 91, 255);
```

### `cpu.ft`

```ft
use Fip.raylib as rl

use "paddle.ft"

object Cpu implements(IPaddle):
	data: DPaddle paddle;
	func: FPaddleCommon;
	Cpu(paddle);

	const def ball_passed(Ball ball) -> bool:
		return ball.get_x() + ball.get_radius() > paddle.pos.x;

	def update(f32 ball_y, f32 delta):
		if paddle.pos.y - 10.0 > ball_y:
			paddle.pos.y -= paddle.speed * delta;
		else if paddle.pos.y + 10.0 < ball_y:
			paddle.pos.y += paddle.speed * delta;
		self.clamp_position();

	def reset():
		paddle.pos = f32x2(rl.GetScreenWidth() - paddle.size.x / 2 - 10, rl.GetScreenHeight() / 2);
```

### `paddle.ft`

```ft
use Fip.raylib as rl

use "colors.ft"

interface IPaddle:
	const def ball_passed(Ball ball) -> bool;
	const def collides_with(Ball ball) -> bool;
	const def draw();
	def clamp_position();
	def reset();

data DPaddle:
	i32x2 size = i32x2(24, 120);
	f32x2 pos = f32x2(0, 0);
	f32 speed = 370;
	DPaddle(size, pos, speed);

func FPaddleCommon requires(DPaddle paddle):
	const def draw():
		i32x2 render_pos = i32x2(paddle.pos) - paddle.size / 2;
		rl.Rectangle rec = rl.Rectangle(render_pos.x, render_pos.y, paddle.size.x, paddle.size.y);
		rl.DrawRectangleRounded(rec, 0.8, 0, Colors.white);

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

	def clamp_position():
		const f32 border_distance = 10.0;
		const f32 min_y = f32(paddle.size.y / 2) + border_distance;
		const f32 max_y = f32(rl.GetScreenHeight() - paddle.size.y / 2) - border_distance;

		if paddle.pos.y < min_y:
			paddle.pos.y = min_y;
		else if paddle.pos.y > max_y:
			paddle.pos.y = max_y;
```

### `player.ft`

```ft
use Fip.raylib as rl

use "paddle.ft"

object Player implements(IPaddle):
	data: DPaddle paddle;
	func: FPaddleCommon;
	Player(paddle);

	const def ball_passed(Ball ball) -> bool:
		return ball.get_x() - ball.get_radius() < paddle.pos.x;

	def update(f32 delta):
		if rl.IsKeyDown(i32(rl.KeyboardKey.KEY_UP)):
			paddle.pos = paddle.pos - (0.0, paddle.speed * delta);
		if rl.IsKeyDown(i32(rl.KeyboardKey.KEY_DOWN)):
			paddle.pos = paddle.pos + (0.0, paddle.speed * delta);
		FPaddleCommon.clamp_position(paddle);

	def reset():
		paddle.pos = f32x2(10 + paddle.size.x / 2, rl.GetScreenHeight() / 2);
```
