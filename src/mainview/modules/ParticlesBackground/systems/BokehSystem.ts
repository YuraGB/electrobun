import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import type { BokehParticle } from "../particles/BokehParticle";
import type { BokehPool } from "../particles/BokehPool";
import { horizontalBand } from "../particles/ParticleDistribution";

export class BokehSystem implements System {
	constructor(private readonly pool: BokehPool) {
		for (const particle of this.pool.particles) {
			particle.position.x = Math.random() * window.innerWidth;
			particle.position.y = Math.random() * window.innerHeight;
			particle.depth = 0.95 + Math.random() * 0.05;
			particle.radius = 120;
			particle.alpha = 0.04;

			particle.velocity.set(
				0.08 + Math.random() * 0.12,
				this.randomGaussian() * 0.02,
			);
		}
	}

	update(context: EngineContext) {
		for (const particle of this.pool.particles) {
			const wind = context.wind.getY(particle, context.time);

			particle.position.y += wind * 0.15 * context.time.delta;

			particle.position.addScaled(particle.velocity, context.time.delta);

			this.wrapParticle(
				particle,
				context.renderer.width,
				context.renderer.height,
			);
		}
	}

	render(context: EngineContext) {
		for (const particle of this.pool.particles) {
			const screen = context.camera.worldToScreen(particle.position, 2.0);

			const alpha =
				particle.alpha +
				Math.sin(context.time.elapsed * 0.08 + particle.twinkleOffset) * 0.02;

			context.renderer.drawBokeh(
				screen.x,
				screen.y,
				particle.radius,
				"#ffffff",
				alpha,
			);
		}
	}

	private wrapParticle(particle: BokehParticle, width: number, height: number) {
		const margin = 100;

		if (particle.position.x > width + margin) {
			particle.position.x = -margin;

			const position = horizontalBand(width, height);

			particle.position.y = position.y;
		}
	}

	private randomGaussian() {
		let u = 0;
		let v = 0;

		while (u === 0) u = Math.random();
		while (v === 0) v = Math.random();

		return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
	}
}
