import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";

export class LightShaftSystem implements System {
	update(_context: EngineContext) {}

	render(context: EngineContext) {
		context.renderer.drawSunRays(context.time.elapsed);
	}
}
