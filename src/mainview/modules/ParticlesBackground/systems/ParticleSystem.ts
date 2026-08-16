import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Config } from "../engine/Config";
import { Vector2 } from "../math/Vector2";
import type { Particle } from "../particles/Particle";
import type { ParticlePool } from "../particles/ParticlePool";
import { gaussian } from "../utils/Random";

export class ParticleSystem implements System {
	private readonly screen = new Vector2();

	constructor(private readonly pool: ParticlePool) {
		for (const particle of this.pool.particles) {
			particle.depth = Math.random() ** 3;
			particle.waveLayer = Math.random();
			particle.wavePhase = gaussian() * 0.22;
			particle.waveOffset =
				gaussian() *
				window.innerHeight *
				Config.particles.waveBand *
				(0.55 + particle.depth * 0.45);

			const speed =
				Config.particles.minSpeed +
				particle.depth *
					(Config.particles.maxSpeed - Config.particles.minSpeed);

			particle.velocity.set(speed, 0);

			particle.position.x = Math.random() * window.innerWidth;
			particle.position.y = this.getWaveY(
				particle,
				particle.position.x,
				window.innerWidth,
				window.innerHeight,
				0,
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
		const { width, height } = context.renderer;
		const delta = context.time.delta;
		const settle = 1 - Math.exp(-Config.particles.waveSettle * delta);

		for (const particle of this.pool.particles) {
			particle.position.addScaled(particle.velocity, delta);

			const targetY = this.getWaveY(
				particle,
				particle.position.x,
				width,
				height,
				context.time.elapsed,
			);

			particle.position.y += (targetY - particle.position.y) * settle;

			this.wrapParticle(particle, width, height, context.time.elapsed);
		}
	}

	private getWaveY(
		particle: Particle,
		x: number,
		width: number,
		height: number,
		elapsed: number,
	) {
		const center = height * Config.particles.waveCenter;
		const amplitude = height * Config.particles.waveAmplitude;
		const wavelength = Math.max(width * Config.particles.waveLength, 1);
		const phase =
			(x / wavelength) * Math.PI * 2 -
			elapsed * Config.particles.waveDriftSpeed +
			particle.wavePhase;
		const slowSwell = Math.sin(phase * 0.47 + particle.wavePhase * 0.35) * 0.32;
		const depthScale =
			0.72 + particle.depth * 0.34 + (particle.waveLayer - 0.5) * 0.08;

		return (
			center +
			(Math.sin(phase) + slowSwell) * amplitude * depthScale +
			particle.waveOffset
		);
	}

	private respawnParticle(
		particle: Particle,
		width: number,
		height: number,
		elapsed: number,
	) {
		const margin = 50;

		particle.position.x = -margin;
		particle.waveOffset =
			gaussian() *
			height *
			Config.particles.waveBand *
			(0.55 + particle.depth * 0.45);
		particle.position.y = this.getWaveY(
			particle,
			particle.position.x,
			width,
			height,
			elapsed,
		);
	}

	private wrapParticle(
		particle: Particle,
		width: number,
		height: number,
		elapsed: number,
	) {
		const margin = 50;

		if (particle.position.x > width + margin) {
			this.respawnParticle(particle, width, height, elapsed);
		}
	}

	render(context: EngineContext) {
		for (const particle of this.pool.particles) {
			const parallax = 0.1 + particle.depth * Config.particles.parallaxStrength;
			const screen = context.camera.worldToScreenInto(
				particle.position,
				parallax,
				this.screen,
			);
			const twinkleAmount = 0.02 + particle.depth * 0.08;

			const twinkle =
				1 -
				twinkleAmount +
				Math.sin(
					context.time.elapsed * particle.twinkleSpeed + particle.twinkleOffset,
				) *
					twinkleAmount;

			if (Config.particles.drawGlows) {
				const glowRadius = particle.radius * (2 + particle.depth * 3);
				const glowAlpha = particle.alpha * 0.12;

				context.renderer.drawGlow(
					screen.x,
					screen.y,
					glowRadius,
					"#ffffff",
					glowAlpha,
				);
			}

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
