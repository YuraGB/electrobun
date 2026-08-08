import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import type { Particle } from "../particles/Particle";
import type { ParticlePool } from "../particles/ParticlePool";

export class ParticleSystem implements System {
	constructor(private readonly pool: ParticlePool) {
		for (const particle of this.pool.particles) {
			particle.position.set(
				Math.random() * window.innerWidth,
				Math.random() * window.innerHeight,
			);
			particle.velocity.set(
				(Math.random() - 0.5) * 20,
				(Math.random() - 0.5) * 20,
			);
			particle.radius = Math.random() * 2 + 1;

			particle.alpha = Math.random() * 0.5 + 0.5;
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
		if (particle.position.x < 0) {
			particle.position.x = width;
		}

		if (particle.position.x > width) {
			particle.position.x = 0;
		}

		if (particle.position.y < 0) {
			particle.position.y = height;
		}

		if (particle.position.y > height) {
			particle.position.y = 0;
		}
	}

	render(context: EngineContext) {
		for (const particle of this.pool.particles) {
			context.renderer.drawCircle(
				particle.position.x,
				particle.position.y,
				particle.radius,
				"#ffffff",
				particle.alpha,
			);
		}
	}
}
