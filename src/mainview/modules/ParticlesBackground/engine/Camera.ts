import { Vector2 } from "../math/Vector2";

export class Camera {
	readonly position = new Vector2();

	readonly target = new Vector2();

	zoom = 1;

	smoothness = 0.08;

	update() {
		this.position.lerp(this.target, 0.05);
	}

	worldToScreen(point: Vector2): Vector2 {
		return point.clone().sub(this.position).multiplyScalar(this.zoom);
	}
}
