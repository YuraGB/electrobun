import { Vector2 } from "../math/Vector2";
import { gaussian } from "../utils/Random";

export function uniform(width: number, height: number): Vector2 {
	return new Vector2(Math.random() * width, Math.random() * height);
}

export function horizontalBand(width: number, height: number): Vector2 {
	const center = height * 0.62;
	const spread = height * 0.08;

	return new Vector2(Math.random() * width, center + gaussian() * spread);
}
