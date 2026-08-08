export class Time {
	private last = performance.now();

	delta = 0;

	elapsed = 0;

	update() {
		const now = performance.now();

		this.delta = (now - this.last) / 1000;

		this.elapsed += this.delta;

		this.last = now;
	}
}
