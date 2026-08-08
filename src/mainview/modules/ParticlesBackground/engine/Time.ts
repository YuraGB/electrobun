export class Time {
	private last = performance.now();

	delta = 0;
	elapsed = 0;

	fps = 0;

	private frames = 0;
	private fpsTimer = 0;

	update() {
		const now = performance.now();

		this.delta = (now - this.last) / 1000;
		this.elapsed += this.delta;

		this.last = now;

		this.frames++;
		this.fpsTimer += this.delta;

		if (this.fpsTimer >= 1) {
			this.fps = this.frames;

			this.frames = 0;
			this.fpsTimer = 0;

			console.log(`FPS: ${this.fps}`);
		}
	}
}
