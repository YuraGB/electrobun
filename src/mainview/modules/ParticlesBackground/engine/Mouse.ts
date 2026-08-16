import { Vector2 } from "../math/Vector2";

export class Mouse {
	readonly position = new Vector2();

	readonly target = new Vector2();

	smoothness = 0.08;

	constructor() {
		window.addEventListener("pointermove", this.onPointerMove, {
			passive: true,
		});
	}

	destroy() {
		window.removeEventListener("pointermove", this.onPointerMove);
	}

	update() {
		this.position.lerp(this.target, this.smoothness);
	}

	private onPointerMove = (event: PointerEvent) => {
		this.target.set(event.clientX, event.clientY);
	};
}
