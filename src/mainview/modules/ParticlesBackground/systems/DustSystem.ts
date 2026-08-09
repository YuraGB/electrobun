import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Config } from "../engine/Config";
import { DustParticle } from "../particles/DustParticle";
import { horizontalBand } from "../particles/ParticleDistribution";

export class DustSystem implements System {
	private readonly particles: DustParticle[] = [];

	constructor() {
		for (let i = 0; i < 20000; i++) {
			const particle = new DustParticle();
			const position = horizontalBand(window.innerWidth, window.innerHeight);

			particle.position.copy(position);

			particle.alpha =
				Config.dust.minAlpha +
				Math.random() * (Config.dust.maxAlpha - Config.dust.minAlpha);

			this.particles.push(particle);
		}
	}

	update(_context: EngineContext) {}

	render(context: EngineContext) {
		for (const particle of this.particles) {
			const screen = context.camera.worldToScreen(
				particle.position,
				particle.depth * 0.15,
			);

			context.renderer.drawPoint(screen.x, screen.y, "#ffffff", particle.alpha);
		}
	}
}
