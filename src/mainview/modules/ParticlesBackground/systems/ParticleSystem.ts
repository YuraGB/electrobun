import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Vector2 } from "../math/Vector2";
import type { Particle } from "../particles/Particle";
import type { ParticlePool } from "../particles/ParticlePool";

export class ParticleSystem implements System {
	constructor(private readonly pool: ParticlePool) {
		for (const particle of this.pool.particles) {
			particle.position.set(
				Math.random() * window.innerWidth,
				Math.random() * window.innerHeight,
			);
			particle.depth = Math.random() * 0.8 + 0.2;
			const speed = 3 + particle.depth * 6;

			const direction = Vector2.random();

			particle.velocity.copy(direction).multiplyScalar(speed);
			particle.radius = 1 + particle.depth * 3;

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

	private wrapParticle(particle: Particle, width: number, height: number) {
		const margin = 50;

		if (particle.position.x < -margin) {
			particle.position.x = width + margin;
		}

		if (particle.position.x > width + margin) {
			particle.position.x = -margin;
		}

		if (particle.position.y < -margin) {
			particle.position.y = height + margin;
		}

		if (particle.position.y > height + margin) {
			particle.position.y = -margin;
		}
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
