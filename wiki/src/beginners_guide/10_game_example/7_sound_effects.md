# Sound Effects

A game without *any* sound-effects is a very boring game. We will add *very* simple sound-effects to Pong, but don't expect something fancy here, it will just be a beep when the ball collides with the paddles. This is just to usefully showcase a few more advanced interop features, like pointers, opaques etc.

## Basic Setup

As usual, the `data` is where everything begins. In this case it's the `const data`:

**`audio.ft`**:
```ft
use Core.print
use Core.time
use Core.math

use Fip.raylib as rl

const data AudioConfig:
	int SAMPLE_RATE = 44100;
	int BUFFER_SIZE = 1024;
	float COLLISION_FREQUENCY = 220.0;
```

For audio playback we need a `SAMPLE_RATE` and a `BUFFER_SIZE` for our audio buffer. The `COLLISION_FREQUENCY` is the frequency which is played on collision, when the ball collides with a paddle. And now the "real" data, `DAudio`:

```ft
data DAudio:
	rl.AudioStream stream = rl.LoadAudioStream(u32(AudioConfig.SAMPLE_RATE), 32, 1);
	f32[] buffer = f32[AudioConfig.BUFFER_SIZE](0.0);
	f32 phase = 0.0;
	f32 frequency = 440.0;
	u32 total_frames = 0;
	u32 frames_written = 0;
	bool playing = false;
	DAudio(stream, buffer, phase, frequency, total_frames, frames_written, playing);
```

The data has quite a lot of fields this time around. This is because we initially need to set some values and then call `update` to incrementally play back more audio. As you can see, we default-initialze the `buffer` to be zero-filled and of size `BUFFER_SIZE`. The important type, however, is the `rl.AudioStream` here which will be default-initialized using `rl.LoadAudioStream`. If we look at the `raylib.ft` these two look like that:

```ft
data AudioStream:
	opaque buffer;
	opaque processor;
	u32 sampleRate;
	u32 sampleSize;
	u32 channels;
	AudioStream(buffer, processor, sampleRate, sampleSize, channels);

extern def LoadAudioStream(mut u32 sampleRate, mut u32 sampleSize, mut u32 channels) -> AudioStream;
```

As you can see, the `AudioStream` data type has two values which are `opaque` fields. This means that they are pointer somewhere in C, but since pointers are only allowed in extern contexts in Flint, these pointer fields become `opaque` pointers. The structure looks like this in C:

```c
// Opaque structs declaration
// NOTE: Actual structs are defined internally in raudio module
typedef struct rAudioBuffer rAudioBuffer;
typedef struct rAudioProcessor rAudioProcessor;

// AudioStream, custom audio stream
typedef struct AudioStream {
    rAudioBuffer *buffer;       // Pointer to internal data used by the audio system
    rAudioProcessor *processor; // Pointer to internal data processor, useful for audio effects

    unsigned int sampleRate;    // Frequency (samples per second)
    unsigned int sampleSize;    // Bit depth (bits per sample): 8, 16, 32 (24 not supported)
    unsigned int channels;      // Number of channels (1-mono, 2-stereo, ...)
} AudioStream;
```

As you can direclty read from the raylib documentation, the `rAudioBuffer` and `rAudioProcessor` are *opaque structs* here, so the `rAudioBuffer *` pointer here is, quite literally, an opaque pointer since it's an pointer into memory we have no information about.

Next up we create the `Audio` object with the functions all unimplemented for now:

```ft
object Audio:
	data: DAudio a;
	Audio(a);

	def play(f32 freq, Duration duration):
		return;

	def update():
		return;

	def stop():
		return;

	def deinit():
		return;
```

Wtih the `play` function we will *start* to play a given frequency for a given duration, the `update` just needs to be called on each frame update, and `stop` will only be called internally by `update` if the currently playing sound is "finished". The `deinit` function needs to be called at the very end of the program, before shutdown.

We also add a small helper function to the `audio.ft` file to make creating an `Audio` instance easier:

```ft
def init_audio() -> Audio:
	print("init audio\n");
	rl.InitAudioDevice();
	rl.SetAudioStreamBufferSizeDefault(AudioConfig.BUFFER_SIZE);
	return Audio(DAudio(_));
```

The `InitAudioDevice` and `SetAudioStreamBufferSizeDefault` functions look like this in `raylib.ft`:

```ft
extern def InitAudioDevice();
extern def SetAudioStreamBufferSizeDefault(mut i32 size);
```

and like this in the raylib header file:

```c
RLAPI void InitAudioDevice(void);                      // Initialize audio device and context
RLAPI void SetAudioStreamBufferSizeDefault(int size); // Default size for new audio streams
```

With this, the overall structure of the `audio.ft` file is finished. Now, in the `main.ft` we add initialization of audio before initializing the objects:

```ft
	// Set up audio
	Audio a = init_audio();
```

and deinit it at the very end:

```ft
	a.deinit();
	rl.CloseWindow();
```

## Playing Audio

We want to play the beep whenever we detect a collision. Since we detect collisions in the `collisions.ft` file, we need to pass the `Audio` object as an parameter to the `check_collisions` function and then just call `a.play(...)` when the ball collides with any paddle:

```ft
def check_collisions(mut Audio a, mut Ball ball, FPaddleCommon player, FPaddleCommon cpu) -> GameState:
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

and then, we also need to pass the constructed `Audio` object `a` to the `check_collisions` call in the `main.ft` file too:

```ft
		switch check_collisions(a, ball, player, cpu):
			// ...
```

We also need to add the `use "audio.ft"` clausel to both `main.ft` and `collisions.ft` too, and we need to add `Core.time` to the `collisions.ft` file.

## Implementation

Okay, with this we now have the overall structure up, now we just need to implement the functions of the `Audio` object type.

### `deinit`

Lets start with the `deinit` function. We call the `UnloadAudioStream` and `CloseAudioDevice` functions in it:

```ft
	def deinit():
		rl.UnloadAudioStream(a.stream);
		rl.CloseAudioDevice();
```

This does exactly what it sounds like. We unload our audio stream we initially loaded using the `LoadAudioStream` function of raylib and then we close the audio device we created with `InitAudioDevice` in `init_audio`.

### `stop`

The implementation of the `stop` function is equally simple, we just set the `playing` field of the audio data to false and then call the `StopAudioStream` function of raylib to stop the audio stream which we (will) start in the `play` function.

```ft
	def stop():
		a.playing = false;
		rl.StopAudioStream(a.stream);
```

### `play`

The `play` function is responsible for calculating the number of total frames which need to be written for an audio signal of a given frequency to be played for a given time with our given sample rate:

```ft
	def play(f32 freq, Duration duration):
		print($"audio play {freq}Hz for {as_unit(duration, TimeUnit.MS)}ms\n");
		a.frequency = freq;
		a.phase = 0.0;
		a.frames_written = 0;
		a.total_frames = u32(as_unit(duration, TimeUnit.S) * f32(AudioConfig.SAMPLE_RATE));
		a.playing = true;
		rl.PlayAudioStream(a.stream);
```

### `update`

The `update` function is by far the most complicated of the bunch. I will segment it's implementation piece by piece here and explain it. The implementation starts with early-exits if the audio is not playing, or when raylib has not yet processed everything we gave it to process audio-wise:

```ft
	def update():
		if not a.playing:
			return;
		if not rl.IsAudioStreamProcessed(a.stream):
			return;

		// Check if we are done playing the audio
		if a.frames_written >= a.total_frames:
			self.stop();
			return;
```

The `IsAudioStreamProcessed` essentially just checks if raylib has finished consuming the previous chunk we sent it (to avoid overwriting unplayed data, which causes clicks/pops). In the last early-return we just check if we have written more frames than the total requested frame count (from the `play` function), in that case we stop further audio playing and return.

```ft
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
```

In this next chunk we calculate the `chunk` to describe how many bytes we need to write into the `buffer` which we then later pass to raylib for audio playback. The `phase_step` is essentially the radian difference between each data point in the buffer. It is directly dependent from the sample rate, the higher the sample rate the smaller this value gets. And then we just update the buffer by calculating the sine function from the phase. The cummulative inaccurracy of adding the phase step over and over again to the phase is neglectible here.

```ft
		// Pass the buffer to the audio stream function to tell raylib what to process next
		rl.UpdateAudioStream(a.stream, &a.buffer, i32(chunk));
		a.frames_written += chunk;
```

And lastly we pass the buffer to the `UpdateAudioStream` function of raylib:

```ft
extern def UpdateAudioStream(mut AudioStream stream, const opaque _data, mut i32 frameCount);
```

it expects an opaque pointer to the data. When we apply the reference operator `&` on a dynamic array like `buffer`, which is of type `i32[]` the resulting value is not of type `i32[]*` but it's of type `i32*`. The pointer from the reference operator directly points at the first byte of the data section in the array. In C, an array does not have a length, but since all arrays in Flint are always stored in one large chunk, we can very easily pass a pointer to that chunk to raylib.

## Conclusion

And with all that, we now have working audio in our little game. Audio is quite complex for the little we do with it here, but I think that's okay. I tried to keep the audio system as small and minimal as possible.
