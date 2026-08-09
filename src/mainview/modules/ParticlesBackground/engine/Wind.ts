import type { Particle } from "../particles/Particle";
import type { Time } from "./Time";

export class Wind {
	getY(particle: Particle, time: Time) {
		const xWave = Math.sin(particle.position.x * 0.008 + time.elapsed * 0.15);

		const yWave = Math.sin(particle.position.y * 0.01 - time.elapsed * 0.1);

		const depthWave = Math.sin(
			time.elapsed * 0.2 + particle.twinkleOffset * 1.5,
		);

		return xWave * 1.5 + yWave * 0.8 + depthWave * 0.7;
	}
}
