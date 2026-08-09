import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Config } from "../engine/Config";
import type { Particle } from "../particles/Particle";
import { horizontalBand } from "../particles/ParticleDistribution";
import type { ParticlePool } from "../particles/ParticlePool";
import { gaussian } from "../utils/Random";

export class ParticleSystem implements System {
	constructor(private readonly pool: ParticlePool) {
		for (const particle of this.pool.particles) {
			particle.depth = Math.random() ** 3;

			const speed =
				Config.particles.minSpeed +
				particle.depth *
					(Config.particles.maxSpeed - Config.particles.minSpeed);

			particle.velocity.set(speed, gaussian() * 2);

			const center = window.innerHeight * 0.62;
			const spread = window.innerHeight * (0.05 + particle.depth * 0.08);

			particle.position.set(
				Math.random() * window.innerWidth,
				center + gaussian() * spread,
			);
			const t = particle.depth;

			if (t < 0.7) {
				particle.radius = 1;
			} else if (t < 0.95) {
				particle.radius = 2;
			} else {
				particle.radius =
					Config.particles.largeRadiusMin +
					Math.random() *
						(Config.particles.largeRadiusMax - Config.particles.largeRadiusMin);
			}
			particle.alpha =
				Config.particles.minAlpha +
				particle.depth *
					(Config.particles.maxAlpha - Config.particles.minAlpha);
		}
	}

	update(context: EngineContext) {
		for (const particle of this.pool.particles) {
			const windY =
				context.wind.getY(particle, context.time) *
				(0.3 + particle.depth * 0.7);

			particle.position.y += windY * context.time.delta;

			// Основна зона частинок: приблизно 40–84% viewport.
			const center = context.renderer.height * 0.72;
			const range = context.renderer.height * 0.72;

			if (particle.position.y < center - range) {
				particle.position.y += (center - range - particle.position.y) * 0.015;
			}

			if (particle.position.y > center + range) {
				particle.position.y -= (particle.position.y - (center + range)) * 0.015;
			}

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

	render(context: EngineContext) {
		for (const particle of this.pool.particles) {
			const parallax = 0.1 + particle.depth * Config.particles.parallaxStrength;
			const screen = context.camera.worldToScreen(particle.position, parallax);
			const twinkleAmount = 0.02 + particle.depth * 0.08;

			const twinkle =
				1 -
				twinkleAmount +
				Math.sin(
					context.time.elapsed * particle.twinkleSpeed + particle.twinkleOffset,
				) *
					twinkleAmount;

			const glowRadius = particle.radius * (2 + particle.depth * 3);
			const glowAlpha = particle.alpha * 0.12;

			context.renderer.drawGlow(
				screen.x,
				screen.y,
				glowRadius,
				"#ffffff",
				glowAlpha,
			);

			context.renderer.drawCircle(
				screen.x,
				screen.y,
				particle.radius,
				"#ffffff",
				particle.alpha * twinkle,
			);
		}
	}
}
