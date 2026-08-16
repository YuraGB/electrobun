import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Config } from "../engine/Config";
import { Vector2 } from "../math/Vector2";
import type { BokehParticle } from "../particles/BokehParticle";
import type { BokehPool } from "../particles/BokehPool";
import { horizontalBand } from "../particles/ParticleDistribution";
import { gaussian } from "../utils/Random";

export class BokehSystem implements System {
	private readonly screen = new Vector2();

	constructor(private readonly pool: BokehPool) {
		for (const particle of this.pool.particles) {
			particle.position.x = Math.random() * window.innerWidth;
			particle.position.y = Math.random() * window.innerHeight;
			particle.depth = 0.95 + Math.random() * 0.05;
			particle.radius =
				Config.bokeh.minRadius +
				Math.random() * (Config.bokeh.maxRadius - Config.bokeh.minRadius);
			particle.alpha =
				Config.bokeh.minAlpha +
				Math.random() * (Config.bokeh.maxAlpha - Config.bokeh.minAlpha);

			particle.velocity.set(
				Config.bokeh.minSpeed +
					Math.random() * (Config.bokeh.maxSpeed - Config.bokeh.minSpeed),
				gaussian() * Config.bokeh.verticalSpeed,
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
			const screen = context.camera.worldToScreenInto(
				particle.position,
				2.0,
				this.screen,
			);

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
}
