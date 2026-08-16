import { Config } from "./Config";

export class Renderer {
	readonly canvas: HTMLCanvasElement;
	private readonly lightMask = new Image();
	private readonly ctx: CanvasRenderingContext2D;
	private readonly glowSprites = new Map<string, HTMLCanvasElement>();
	private readonly bokehSprites = new Map<string, HTMLCanvasElement>();
	width = 0;

	height = 0;
	private rays: {
		angleOffset: number;
		lane: number;
		width: number;
		length: number;
		alpha: number;
		speed: number;
		phase: number;
		pulseSpeed: number;
		pulsePhase: number;
	}[] = [];
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.lightMask.src = "/mask.svg";

		const ctx = canvas.getContext("2d", {
			alpha: false,
			desynchronized: true,
		});

		if (!ctx) {
			throw new Error("Canvas2D is not supported");
		}

		const rayCount = Config.lightShafts.count;

		this.rays = Array.from({ length: rayCount }, (_, i) => {
			const lane = rayCount === 1 ? 0 : i / (rayCount - 1) - 0.5;

			return {
				angleOffset: lane * 0.08 + (Math.random() - 0.5) * 0.025,
				lane,
				width: 70 + Math.random() * 110,
				length: 0.92 + Math.random() * 0.22,
				alpha: 0.014 + Math.random() * 0.018,
				speed: 0.025 + Math.random() * 0.055,
				phase: Math.random() * Math.PI * 2,
				pulseSpeed: 0.08 + Math.random() * 0.05,
				pulsePhase: Math.random() * Math.PI * 2,
			};
		});

		this.ctx = ctx;

		this.resize();
	}

	drawSunRays(timestamp: number) {
		const ctx = this.ctx;
		const originX = this.width * -0.07;
		const originY = this.height * -0.4;
		const targetX = this.width * 0.18;
		const targetY = this.height * 0.82;
		const baseAngle = Math.atan2(targetY - originY, targetX - originX);
		const length = Math.hypot(this.width, this.height) * 1.25;

		ctx.save();
		ctx.globalCompositeOperation = "screen";

		const bloomRadius = Math.max(this.width, this.height) * 0.78;
		const bloom = ctx.createRadialGradient(
			originX,
			originY,
			0,
			originX,
			originY,
			bloomRadius,
		);
		bloom.addColorStop(0, "rgba(255,244,205,0.22)");
		bloom.addColorStop(0.22, "rgba(255,230,170,0.095)");
		bloom.addColorStop(0.55, "rgba(120,190,255,0.036)");
		bloom.addColorStop(1, "rgba(0,0,0,0)");

		ctx.fillStyle = bloom;
		ctx.fillRect(0, 0, this.width, this.height);

		this.drawBeam(
			originX,
			originY,
			baseAngle,
			length,
			this.height * 0.05,
			this.height * 0.5,
			0,
			0.026,
		);

		for (const ray of this.rays) {
			const wave = Math.sin(timestamp * ray.speed + ray.phase);
			const pulse =
				0.72 +
				(Math.sin(timestamp * ray.pulseSpeed + ray.pulsePhase) + 1) * 0.14;
			const angle = baseAngle + ray.angleOffset + wave * 0.006;
			const endOffset =
				ray.lane * this.height * 0.22 +
				Math.sin(timestamp * ray.speed * 0.6 + ray.phase) * 12;
			const rayLength = length * ray.length;

			this.drawBeam(
				originX,
				originY,
				angle,
				rayLength,
				14,
				ray.width * 1.1,
				endOffset,
				ray.alpha * pulse * 0.34,
			);
			this.drawBeam(
				originX,
				originY,
				angle,
				rayLength,
				8,
				ray.width * 0.52,
				endOffset * 0.88,
				ray.alpha * pulse,
			);
		}

		ctx.restore();
	}

	private drawBeam(
		x: number,
		y: number,
		angle: number,
		length: number,
		startHalfWidth: number,
		endHalfWidth: number,
		endOffset: number,
		alpha: number,
	) {
		const ctx = this.ctx;

		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(angle);

		const gradient = ctx.createLinearGradient(0, 0, length, 0);
		gradient.addColorStop(0, "rgba(255,245,205,0)");
		gradient.addColorStop(0.08, `rgba(255,245,205,${alpha * 0.55})`);
		gradient.addColorStop(0.32, `rgba(255,238,190,${alpha})`);
		gradient.addColorStop(0.66, `rgba(155,210,255,${alpha * 0.45})`);
		gradient.addColorStop(1, "rgba(0,0,0,0)");

		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.moveTo(0, -startHalfWidth);
		ctx.lineTo(length, endOffset - endHalfWidth);
		ctx.lineTo(length, endOffset + endHalfWidth);
		ctx.lineTo(0, startHalfWidth);
		ctx.closePath();
		ctx.fill();

		ctx.restore();
	}

	drawAmbientLight() {
		const ctx = this.ctx;

		ctx.save();

		ctx.globalCompositeOperation = "screen";

		// Злегка розтягуємо градієнт по X, щоб він був схожий
		// на світло від сонця поза кадром.
		ctx.translate(this.width * 0.92, this.height * 0.08);
		ctx.scale(1.45, 1);

		const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width * 0.45);

		gradient.addColorStop(0.0, "rgba(255,245,220,0.42)");
		gradient.addColorStop(0.15, "rgba(255,245,220,0.22)");
		gradient.addColorStop(0.35, "rgba(255,245,220,0.10)");
		gradient.addColorStop(0.65, "rgba(255,245,220,0.03)");
		gradient.addColorStop(1.0, "rgba(255,245,220,0)");

		ctx.fillStyle = gradient;

		ctx.fillRect(-this.width, -this.height, this.width * 2, this.height * 2);

		ctx.restore();
	}

	drawGlow(x: number, y: number, radius: number, color = "#ffffff", alpha = 1) {
		if (alpha <= 0 || radius <= 0) {
			return;
		}

		const spriteRadius = Math.max(1, Math.ceil(radius));
		const sprite = this.getGlowSprite(spriteRadius, color);
		const size = spriteRadius * 2;

		this.ctx.globalAlpha = alpha;
		this.ctx.drawImage(sprite, x - spriteRadius, y - spriteRadius, size, size);
		this.ctx.globalAlpha = 1;
	}

	drawLightMask(
		x: number,
		y: number,
		width: number,
		height: number,
		alpha = 1,
		angle = 0,
	) {
		if (!this.lightMask.complete) {
			return;
		}

		const ctx = this.ctx;

		ctx.save();

		ctx.translate(x, y);

		if (angle !== 0) {
			ctx.rotate((angle * Math.PI) / 180);
		}

		ctx.globalCompositeOperation = "screen";
		ctx.globalAlpha = alpha;

		ctx.drawImage(this.lightMask, 0, 0, width, height);

		ctx.restore();

		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
	}

	drawSunLight(
		x: number,
		y: number,
		width: number,
		height: number,
		alpha = 0.02,
		angle = -12,
		time = 0,
	) {
		const ctx = this.ctx;

		ctx.save();

		ctx.translate(x, y);
		ctx.rotate((angle * Math.PI) / 180);

		const beamHeight = height * 0.6;

		// Кожен промінь живе своїм життям
		const phase = x * 0.017;

		const intensity =
			0.75 +
			Math.sin(time * 0.08 + phase) * 0.15 +
			Math.sin(time * 0.13 + phase * 1.8) * 0.1;

		const gradient = ctx.createLinearGradient(0, 0, 0, beamHeight);

		gradient.addColorStop(0.0, "rgba(255,245,210,0)");
		gradient.addColorStop(
			0.08,
			`rgba(255,245,210,${alpha * 0.35 * intensity})`,
		);
		gradient.addColorStop(0.45, `rgba(255,245,210,${alpha * intensity})`);
		gradient.addColorStop(
			0.85,
			`rgba(255,245,210,${alpha * 0.25 * intensity})`,
		);
		gradient.addColorStop(1.0, "rgba(255,245,210,0)");

		ctx.fillStyle = gradient;

		ctx.filter = "blur(10px)";

		const slices = 48;

		for (let i = 0; i < slices; i++) {
			const u = i / (slices - 1);

			// -1 ... 1
			const d = u * 2 - 1;

			// Gaussian falloff
			const edge = Math.exp(-(d * d) * 4);

			ctx.globalAlpha = edge;

			const sliceWidth = width / slices + 1;

			ctx.fillRect(-width / 2 + u * width, 0, sliceWidth, beamHeight);
		}

		// Дуже м'який хвіст
		ctx.filter = "blur(28px)";
		ctx.globalAlpha = 0.35;

		ctx.fillRect(-width / 2, beamHeight * 0.45, width, beamHeight * 0.55);

		ctx.restore();
	}

	drawLightScatter(
		x: number,
		y: number,
		width: number,
		height: number,
		alpha = 0.02,
		angle = -12,
	) {
		this.ctx.save();

		this.ctx.translate(x, y);
		this.ctx.rotate((angle * Math.PI) / 180);

		const steps = 3;

		for (let i = 0; i < steps; i++) {
			const t = i / (steps - 1);

			/*
			 * З глибиною пляма стає значно ширшою.
			 */
			const spread = width * (0.25 + t * 1.6);

			/*
			 * Світло поступово слабшає з глибиною.
			 */
			const intensity = alpha * (1 - t) * (1 - t) * 0.8;

			/*
			 * Великий горизонтальний розкид.
			 *
			 * Кожна пляма має власну стабільну позицію,
			 * але вони більше не формують лінію.
			 */
			const offsetX = Math.sin(i * 17.31) * width * 0.9;

			/*
			 * Невеликий вертикальний зсув,
			 * щоб навіть по Y не було ідеальної лінії.
			 */
			const offsetY = Math.sin(i * 31.73) * height * 0.12;

			const centerY = t * height + offsetY;

			const gradient = this.ctx.createRadialGradient(
				offsetX,
				centerY,
				0,
				offsetX,
				centerY,
				spread,
			);

			gradient.addColorStop(0, `rgba(255,255,255,${intensity})`);

			gradient.addColorStop(0.25, `rgba(255,255,255,${intensity * 0.65})`);

			gradient.addColorStop(0.55, `rgba(255,255,255,${intensity * 0.25})`);

			gradient.addColorStop(1, "rgba(255,255,255,0)");

			this.ctx.fillStyle = gradient;

			this.ctx.beginPath();

			this.ctx.arc(offsetX, centerY, spread, 0, Math.PI * 2);

			this.ctx.fill();
		}

		this.ctx.restore();
	}

	drawBokeh(
		x: number,
		y: number,
		radius: number,
		_color = "#ffffff",
		alpha = 1,
	) {
		if (alpha <= 0 || radius <= 0) {
			return;
		}

		const spriteRadius = Math.max(1, Math.ceil(radius));
		const sprite = this.getBokehSprite(spriteRadius);
		const size = spriteRadius * 2;

		this.ctx.globalAlpha = alpha;
		this.ctx.drawImage(sprite, x - spriteRadius, y - spriteRadius, size, size);
		this.ctx.globalAlpha = 1;
	}

	drawCircle(
		x: number,
		y: number,
		radius: number,
		color = "#ffffff",
		alpha = 1,
	) {
		this.ctx.globalAlpha = alpha;
		this.ctx.fillStyle = color;

		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, Math.PI * 2);
		this.ctx.fill();

		this.ctx.globalAlpha = 1;
	}

	drawPoint(x: number, y: number, color = "#ffffff", alpha = 1) {
		this.ctx.globalAlpha = alpha;
		this.ctx.fillStyle = color;

		this.ctx.fillRect(x, y, 1, 1);

		this.ctx.globalAlpha = 1;
	}

	private getGlowSprite(radius: number, color: string): HTMLCanvasElement {
		const key = `${color}:${radius}`;
		const cached = this.glowSprites.get(key);

		if (cached) {
			return cached;
		}

		const size = radius * 2;
		const sprite = document.createElement("canvas");
		sprite.width = size;
		sprite.height = size;

		const ctx = sprite.getContext("2d");

		if (!ctx) {
			return sprite;
		}

		const gradient = ctx.createRadialGradient(
			radius,
			radius,
			0,
			radius,
			radius,
			radius,
		);
		gradient.addColorStop(0, color);
		gradient.addColorStop(0.15, color);
		gradient.addColorStop(0.4, "rgba(255,255,255,0.2)");
		gradient.addColorStop(1, "rgba(255,255,255,0)");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, size, size);

		this.glowSprites.set(key, sprite);

		return sprite;
	}

	private getBokehSprite(radius: number): HTMLCanvasElement {
		const key = String(radius);
		const cached = this.bokehSprites.get(key);

		if (cached) {
			return cached;
		}

		const size = radius * 2;
		const sprite = document.createElement("canvas");
		sprite.width = size;
		sprite.height = size;

		const ctx = sprite.getContext("2d");

		if (!ctx) {
			return sprite;
		}

		const gradient = ctx.createRadialGradient(
			radius,
			radius,
			0,
			radius,
			radius,
			radius,
		);
		gradient.addColorStop(0.0, "rgba(255,255,255,0.18)");
		gradient.addColorStop(0.2, "rgba(255,255,255,0.15)");
		gradient.addColorStop(0.45, "rgba(255,255,255,0.08)");
		gradient.addColorStop(0.75, "rgba(255,255,255,0.03)");
		gradient.addColorStop(1.0, "rgba(255,255,255,0)");

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, size, size);

		this.bokehSprites.set(key, sprite);

		return sprite;
	}

	resize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.canvas.width = Math.floor(this.width * Config.pixelRatio);
		this.canvas.height = Math.floor(this.height * Config.pixelRatio);

		this.canvas.style.width = `${this.width}px`;
		this.canvas.style.height = `${this.height}px`;

		this.applyPixelRatio();
	}

	private applyPixelRatio() {
		this.ctx.setTransform(Config.pixelRatio, 0, 0, Config.pixelRatio, 0, 0);
	}

	drawText(text: string, x: number, y: number) {
		this.ctx.fillStyle = "#fff";
		this.ctx.font = "14px monospace";
		this.ctx.fillText(text, x, y);
	}
	clear() {
		this.ctx.fillStyle = Config.background;

		this.ctx.fillRect(0, 0, this.width, this.height);
	}
}
