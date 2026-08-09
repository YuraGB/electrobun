import { Vector2 } from "../math/Vector2";

export class BokehParticle {
	position = new Vector2();

	velocity = new Vector2();

	depth = 1;

	radius = 0;

	alpha = 1;

	twinkleOffset = Math.random() * Math.PI * 2;

	twinkleSpeed = 0.08 + Math.random() * 0.05;
}
