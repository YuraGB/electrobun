import { Vector2 } from "../math/Vector2";

export class Particle {
	readonly position = new Vector2();
	readonly velocity = new Vector2();
	twinkleSpeed = 0.5 + Math.random() * 1.5;
	depth = 1;
	twinkleOffset = Math.random() * Math.PI * 2;
	radius = 2;

	alpha = 1;
}
