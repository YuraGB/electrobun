import { Particle } from "../particles/Particle";
import { Time } from "./Time";

export class Wind {
	getY(particle: Particle, time: Time) {
		return Math.sin(time.elapsed * 0.2 + particle.twinkleOffset * 2) * 3;
	}
}
