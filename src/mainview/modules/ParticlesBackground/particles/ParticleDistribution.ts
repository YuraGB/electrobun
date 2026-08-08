import { Vector2 } from "../math/Vector2";

function randomGaussian() {
	let u = 0;
	let v = 0;

	while (u === 0) {
		u = Math.random();
	}

	while (v === 0) {
		v = Math.random();
	}

	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function uniform(width: number, height: number): Vector2 {
	return new Vector2(Math.random() * width, Math.random() * height);
}

export function horizontalBand(width: number, height: number): Vector2 {
	const center = height * 0.62;
	const spread = height * 0.08;

	return new Vector2(Math.random() * width, center + randomGaussian() * spread);
}
