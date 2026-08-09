import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Config } from "../engine/Config";

export class LightShaftSystem implements System {
	update(_: EngineContext) {}

	render(context: EngineContext) {
		const { renderer, time } = context;

		const h = renderer.height;
		const w = renderer.width;

		// --------------------------------
		// Розсіяне світло / scatter
		// --------------------------------

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

		// --------------------------------
		// Сонячні промені
		// --------------------------------

		const height = renderer.height + 300;

		renderer.drawSunLight(
			w * 0.03,
			-120,
			180,
			height,
			0.018,
			-12,
			time.elapsed,
		);

		// 	renderer.drawSunLight(
		// 		w * 0.13,
		// 		-120,
		// 		220,
		// 		height,
		// 		0.016,
		// 		-12,
		// 		time.elapsed,
		// 	);

		// 	renderer.drawSunLight(
		// 		w * 0.2,
		// 		-120,
		// 		200,
		// 		height - 150,
		// 		0.014,
		// 		-12,
		// 		time.elapsed,
		// 	);

		// 	renderer.drawSunLight(
		// 		w * 0.32,
		// 		-120,
		// 		240,
		// 		height,
		// 		0.012,
		// 		-12,
		// 		time.elapsed,
		// 	);
	}
}
