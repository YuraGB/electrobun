import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Vector2 } from "../math/Vector2";
import type { Particle } from "../particles/Particle";
import { horizontalBand } from "../particles/ParticleDistribution";
import type { ParticlePool } from "../particles/ParticlePool";

export class ParticleSystem implements System {
	constructor(private readonly pool: ParticlePool) {
		for (const particle of this.pool.particles) {
			const position = horizontalBand(window.innerWidth, window.innerHeight);

			particle.position.copy(position);

			particle.depth = Math.pow(Math.random(), 3);
			const speed = 3 + particle.depth * 6;

			const direction = Vector2.random();

			particle.velocity.copy(direction).multiplyScalar(speed);
			const t = particle.depth;

			if (t < 0.7) {
				particle.radius = 1;
			} else if (t < 0.95) {
				particle.radius = 2;
			} else {
				particle.radius = 4 + Math.random() * 3;
			}
			particle.alpha = particle.depth * 0.7 + 0.3;
		}
	}

	update(context: EngineContext) {
		for (const particle of this.pool.particles) {
			particle.position.addScaled(particle.velocity, context.time.delta);

			this.wrapParticle(
				particle,
				context.renderer.width,
				context.renderer.height,
			);
		}
	}
	private respawnParticle(particle: Particle, width: number, height: number) {
		const margin = 50;

		particle.position.x = -margin;

		const position = horizontalBand(width, height);

		particle.position.y = position.y;
	}

	private wrapParticle(particle: Particle, width: number, height: number) {
		const margin = 50;

		if (particle.position.x > width + margin) {
			this.respawnParticle(particle, width, height);
		}
	}

	private randomY(height: number) {
		const center = height * 0.62;
		const spread = height * 0.08;

		return center + this.randomGaussian() * spread;
	}

	private randomGaussian() {
		let u = 0;
		let v = 0;

		while (u === 0) u = Math.random();
		while (v === 0) v = Math.random();

		return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
	}

	render(context: EngineContext) {
		for (const particle of this.pool.particles) {
			const parallax = 0.1 + particle.depth * 1;
			const screen = context.camera.worldToScreen(particle.position, parallax);
			const twinkleAmount = 0.05 + particle.depth * 0.1;

			const twinkle =
				1 -
				twinkleAmount +
				Math.sin(
					context.time.elapsed * particle.twinkleSpeed + particle.twinkleOffset,
				) *
					twinkleAmount;

			const alpha = particle.alpha * twinkle;
			context.renderer.drawCircle(
				screen.x,
				screen.y,
				particle.radius,
				"#fff",
				alpha,
			);
		}
	}
}
