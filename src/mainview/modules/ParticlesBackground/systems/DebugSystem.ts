import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Vector2 } from "../math/Vector2";

export class DebugSystem implements System {
	private readonly position = new Vector2(300, 300);

	update(context: EngineContext) {
		this.position.copy(context.mouse.position);
	}

	render(context: EngineContext) {
		const camera = context.camera;

		const near = camera.worldToScreen(this.position, camera.getParallax(0.5));

		const middle = camera.worldToScreen(this.position, camera.getParallax(1));

		const far = camera.worldToScreen(this.position, camera.getParallax(2));

		context.renderer.drawCircle(near.x, near.y, 40, "red");
		context.renderer.drawCircle(middle.x, middle.y, 30, "green");
		context.renderer.drawCircle(far.x, far.y, 20, "blue");
	}
}
