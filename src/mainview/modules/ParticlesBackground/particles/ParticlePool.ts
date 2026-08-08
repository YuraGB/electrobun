import { Particle } from "./Particle";

export class ParticlePool {
	readonly particles: readonly Particle[];

	constructor(size: number) {
		this.particles = Array.from({ length: size }, () => new Particle());
	}
}
