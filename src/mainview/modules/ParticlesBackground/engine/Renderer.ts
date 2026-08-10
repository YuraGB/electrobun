import { Config } from "./Config";

export class Renderer {
	readonly canvas: HTMLCanvasElement;
	private readonly lightMask = new Image();
	private readonly ctx: CanvasRenderingContext2D;
	width = 0;

	height = 0;
	private rays: {
		baseX: number;
		width: number;
		spread: number;
		maxOpacity: number;
		speed: number;
		phase: number;

		canFade: boolean;
		fadeSpeed: number;
		fadePhase: number;
		fadeStrength: number;
	}[] = [];
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.lightMask.src = "/mask.svg";

		const ctx = canvas.getContext("2d");

		if (!ctx) {
			throw new Error("Canvas2D is not supported");
		}

		this.rays = Array.from({ length: 16 }, (_, i) => ({
			baseX: (i / 16) * this.width * 1.2 - this.width * 0.1,

			width: 40 + Math.random() * 70,

			spread: 1.8 + Math.random() * 0.8,

			maxOpacity: 0.035 + Math.random() * 0.04,

			speed: 0.00003 + Math.random() * 0.00004,

			phase: Math.random() * Math.PI * 2,

			// тільки дальні промені будуть зникати
			canFade: i >= 10,

			fadeSpeed: 0.00015 + Math.random() * 0.00008,

			fadePhase: Math.random() * Math.PI * 2,

			fadeStrength: 1,
		}));

		this.ctx = ctx;

		this.resize();
	}

	drawSunRays(timestamp: number) {
		const ctx = this.ctx;
		const h = this.height;

		ctx.save();
		ctx.globalCompositeOperation = "screen";

		for (let i = 0; i < this.rays.length; i++) {
			const ray = this.rays[i];

			const t = timestamp * ray.speed;

			// Повільне хитання
			const topOffset = Math.sin(t + ray.phase) * 16;
			const bottomOffset = Math.sin(t * 0.6 + ray.phase) * 10;

			// Зміщення кількох променів
			const startShift = i === 2 ? 40 : i === 3 ? 70 : i === 4 ? 55 : 0;

			const topX = ray.baseX + startShift + topOffset;
			const bottomX = topX + ray.width * ray.spread + bottomOffset;

			// Плавне згасання лише окремих променів
			let opacity = ray.maxOpacity;

			if (ray.canFade) {
				const cycle =
					(Math.sin(timestamp * ray.fadeSpeed + ray.fadePhase) + 1) * 0.5;

				opacity = ray.maxOpacity * Math.pow(cycle, 6);
			}

			const beamGrad = ctx.createLinearGradient(topX, 100, bottomX, h);

			beamGrad.addColorStop(0, `rgba(215,245,255,${opacity})`);

			beamGrad.addColorStop(0.2, `rgba(135,220,255,${opacity * 0.75})`);

			beamGrad.addColorStop(0.6, `rgba(40,150,230,${opacity * 0.3})`);

			beamGrad.addColorStop(1, "rgba(0,0,0,0)");

			ctx.fillStyle = beamGrad;

			ctx.beginPath();

			ctx.moveTo(topX - ray.width * 5, 0);

			ctx.lineTo(topX + ray.width * 0.5, 0);

			ctx.lineTo(bottomX + ray.width * ray.spread * 0.5, h);

			ctx.lineTo(bottomX - ray.width * ray.spread * 0.5, h);

			ctx.closePath();
			ctx.fill();
		}

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
		const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);

		gradient.addColorStop(0, color);
		gradient.addColorStop(0.15, color);
		gradient.addColorStop(0.4, "rgba(255,255,255,0.2)");
		gradient.addColorStop(1, "transparent");

		this.ctx.globalAlpha = alpha;
		this.ctx.fillStyle = gradient;

		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, Math.PI * 2);
		this.ctx.fill();

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
		color = "#ffffff",
		alpha = 1,
	) {
		const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);

		gradient.addColorStop(0.0, "rgba(255,255,255,0.18)");
		gradient.addColorStop(0.2, "rgba(255,255,255,0.15)");
		gradient.addColorStop(0.45, "rgba(255,255,255,0.08)");
		gradient.addColorStop(0.75, "rgba(255,255,255,0.03)");
		gradient.addColorStop(1.0, "rgba(255,255,255,0)");

		this.ctx.globalAlpha = alpha;

		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, Math.PI * 2);

		this.ctx.fillStyle = gradient;
		this.ctx.fill();

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

	resize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.canvas.width = this.width * Config.pixelRatio;
		this.canvas.height = this.height * Config.pixelRatio;

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
