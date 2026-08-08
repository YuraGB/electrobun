export class Vector2 {
	constructor(
		public x = 0,
		public y = 0,
	) {}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	set(x: number, y: number): this {
		this.x = x;
		this.y = y;

		return this;
	}

	copy(v: Vector2): this {
		this.x = v.x;
		this.y = v.y;

		return this;
	}

	add(v: Vector2): this {
		this.x += v.x;
		this.y += v.y;

		return this;
	}

	sub(v: Vector2): this {
		this.x -= v.x;
		this.y -= v.y;

		return this;
	}

	multiplyScalar(value: number): this {
		this.x *= value;
		this.y *= value;

		return this;
	}

	divideScalar(value: number): this {
		this.x /= value;
		this.y /= value;

		return this;
	}

	length(): number {
		return Math.hypot(this.x, this.y);
	}

	normalize(): this {
		const len = this.length();

		if (len === 0) {
			return this;
		}

		this.divideScalar(len);

		return this;
	}
	addScaled(v: Vector2, scalar: number): this {
		this.x += v.x * scalar;
		this.y += v.y * scalar;

		return this;
	}
	zero(): this {
		this.x = 0;
		this.y = 0;

		return this;
	}
	distanceTo(v: Vector2): number {
		return Math.hypot(this.x - v.x, this.y - v.y);
	}

	lerp(v: Vector2, alpha: number): this {
		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;

		return this;
	}

	static random(): Vector2 {
		const angle = Math.random() * Math.PI * 2;

		return new Vector2(Math.cos(angle), Math.sin(angle));
	}
}
