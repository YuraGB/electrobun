import { Vector2 } from "../math/Vector2";

export class GlowParticle {
	readonly position = new Vector2();

	depth = 1;

	radius = 20;

	alpha = 0.05;
}
