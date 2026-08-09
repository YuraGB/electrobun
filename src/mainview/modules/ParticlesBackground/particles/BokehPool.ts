import { BokehParticle } from "./BokehParticle";

export class BokehPool {
	readonly particles: readonly BokehParticle[];

	constructor(size: number) {
		this.particles = Array.from({ length: size }, () => new BokehParticle());
	}
}
