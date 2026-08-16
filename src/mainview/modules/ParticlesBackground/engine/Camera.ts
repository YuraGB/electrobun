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
		return this.worldToScreenInto(point, parallax, new Vector2());
	}

	worldToScreenInto(point: Vector2, parallax: number, out: Vector2): Vector2 {
		out.x = (point.x - this.position.x * parallax) * this.zoom;
		out.y = (point.y - this.position.y * parallax) * this.zoom;

		return out;
	}
}
