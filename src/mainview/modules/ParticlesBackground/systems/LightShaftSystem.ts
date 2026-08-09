import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";

export class LightShaftSystem implements System {
	update(_: EngineContext) {}

	render(context: EngineContext) {
		context.renderer.drawLightShaft(
			150,
			-100,
			220,
			context.renderer.height + 200,
			0.025,
		);

		context.renderer.drawLightShaft(
			420,
			-100,
			180,
			context.renderer.height + 200,
			0.018,
		);

		context.renderer.drawLightShaft(
			760,
			-100,
			260,
			context.renderer.height + 200,
			0.012,
		);
	}
}
