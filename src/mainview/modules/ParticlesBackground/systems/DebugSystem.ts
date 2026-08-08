import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Vector2 } from "../math/Vector2";

export class DebugSystem implements System {
	private readonly position = new Vector2(300, 300);

	update(context: EngineContext) {
		this.position.copy(context.mouse.position);
	}

	render(context: EngineContext) {
		const screen = context.camera.worldToScreen(this.position);

		context.renderer.drawCircle(screen.x, screen.y, 40, "red");
	}
}
