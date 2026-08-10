import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Config } from "../engine/Config";

export class LightShaftSystem implements System {
	update(_: EngineContext) {}

	render(context: EngineContext) {
		const { renderer, time } = context;

		const w = renderer.width;
		const h = renderer.height;

		// ----------------------------
		// Ambient світло
		// ----------------------------

		// renderer.drawAmbientLight();

		// ----------------------------
		// Великі області розсіяного світла
		// ----------------------------

		for (let i = 0; i < Config.lightShafts.count; i++) {
			const position = Config.lightShafts.positions[i];
			const width = Config.lightShafts.widths[i];
			const alpha = Config.lightShafts.alphas[i];

			const drift =
				Math.sin(time.elapsed * Config.lightShafts.driftSpeed + i * 2.5) *
				Config.lightShafts.driftAmount;

			const breathing =
				1 +
				Math.sin(time.elapsed * Config.lightShafts.pulseSpeed + i * 1.7) *
					Config.lightShafts.pulseAmount;

			renderer.drawLightScatter(
				w * position + drift,
				Config.lightShafts.offsetY,
				width * breathing,
				h + Config.lightShafts.extraHeight,
				alpha * breathing,
				Config.lightShafts.angle,
			);
		}

		// ----------------------------
		// Сонячні промені
		// ----------------------------

		renderer.drawSunRays(time.elapsed);

		// ----------------------------
		// Маска
		// ----------------------------

		// renderer.drawLightMask(
		//     0,
		//     0,
		//     w,
		//     h,
		//     0.5,
		//     0,
		// );
	}
}
