const maxDelta = 0.05;

export class Time {
	private last = performance.now();

	delta = 0;
	elapsed = 0;

	fps = 0;

	private frames = 0;
	private fpsTimer = 0;

	reset(now = performance.now()) {
		this.last = now;
		this.delta = 0;
		this.frames = 0;
		this.fpsTimer = 0;
	}

	update(now = performance.now()) {
		this.delta = Math.min((now - this.last) / 1000, maxDelta);
		this.elapsed += this.delta;

		this.last = now;

		this.frames++;
		this.fpsTimer += this.delta;

		if (this.fpsTimer >= 1) {
			this.fps = this.frames;

			this.frames = 0;
			this.fpsTimer = 0;
		}
	}
}
