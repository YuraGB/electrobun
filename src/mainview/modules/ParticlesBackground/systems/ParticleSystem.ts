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
			const speed = 10 + particle.depth * 20;

			const direction = Vector2.random();

			particle.velocity.copy(direction).multiplyScalar(speed);
			particle.radius = Math.random() * 4 + 1;
			particle.depth = Math.random() * 0.8 + 0.2;

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
			const parallax = 0.2 + particle.depth * 0.8;
			const screen = context.camera.worldToScreen(particle.position, parallax);
			const alpha =
				particle.alpha *
				(0.8 + Math.sin(context.time.elapsed + particle.twinkleOffset) * 0.2);
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
