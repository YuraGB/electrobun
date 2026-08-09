import { Vector2 } from "../math/Vector2";

export class Camera {
	readonly position = new Vector2();
	readonly target = new Vector2();

	zoom = 1;
	smoothness = 0.03;

	update() {
		this.position.lerp(this.target, this.smoothness);
	}

	getParallax(depth: number): number {
		return 1 / depth;
	}

	worldToScreen(point: Vector2, parallax = 1): Vector2 {
		return point
			.clone()
			.sub(this.position.clone().multiplyScalar(parallax))
			.multiplyScalar(this.zoom);
	}
}
