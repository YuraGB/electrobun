import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";

import { GlowParticle } from "../particles/GlowParticle";
import { horizontalBand } from "../particles/ParticleDistribution";

export class GlowSystem implements System {
	private readonly particles: GlowParticle[] = [];

	constructor() {
		for (let i = 0; i < 20; i++) {
			const particle = new GlowParticle();

			const position = horizontalBand(window.innerWidth, window.innerHeight);

			particle.position.copy(position);

			particle.depth = Math.random() * 0.5 + 0.5;

			particle.radius = 12 + Math.random() * 28;

			particle.alpha = 0.02 + Math.random() * 0.05;

			this.particles.push(particle);
		}
	}

	update(_context: EngineContext) {}

	render(context: EngineContext) {
		for (const particle of this.particles) {
			const screen = context.camera.worldToScreen(
				particle.position,
				particle.depth,
			);

			context.renderer.drawCircle(
				screen.x,
				screen.y,
				particle.radius,
				"#ffffff",
				particle.alpha,
			);
		}
	}
}
