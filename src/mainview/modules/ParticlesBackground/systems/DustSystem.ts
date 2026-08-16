import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Config } from "../engine/Config";
import { horizontalBand } from "../particles/ParticleDistribution";

export class DustSystem implements System {
	private readonly x: Float32Array;
	private readonly y: Float32Array;
	private readonly depth: Float32Array;
	private readonly alpha: Float32Array;

	constructor() {
		const count = Config.dust.count;

		this.x = new Float32Array(count);
		this.y = new Float32Array(count);
		this.depth = new Float32Array(count);
		this.alpha = new Float32Array(count);

		for (let i = 0; i < count; i++) {
			const position = horizontalBand(window.innerWidth, window.innerHeight);

			this.x[i] = position.x;
			this.y[i] = position.y;
			this.depth[i] = Math.random();
			this.alpha[i] =
				Config.dust.minAlpha +
				Math.random() * (Config.dust.maxAlpha - Config.dust.minAlpha);
		}
	}

	update(_context: EngineContext) {}

	render(context: EngineContext) {
		const camera = context.camera;
		const cameraX = camera.position.x;
		const cameraY = camera.position.y;
		const zoom = camera.zoom;

		for (let i = 0; i < this.x.length; i++) {
			const parallax = this.depth[i] * 0.15;
			const screenX = (this.x[i] - cameraX * parallax) * zoom;
			const screenY = (this.y[i] - cameraY * parallax) * zoom;

			context.renderer.drawPoint(screenX, screenY, "#ffffff", this.alpha[i]);
		}
	}
}
