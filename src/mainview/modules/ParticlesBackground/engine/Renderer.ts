import { Config } from "./Config";

export class Renderer {
	readonly canvas: HTMLCanvasElement;

	private readonly ctx: CanvasRenderingContext2D;

	width = 0;

	height = 0;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;

		const ctx = canvas.getContext("2d");

		if (!ctx) {
			throw new Error("Canvas2D is not supported");
		}

		this.ctx = ctx;

		this.resize();
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

		// Промені на 60% коротші
		const beamHeight = height * 0.6;

		/*
		 * Фаза залежить від положення променя.
		 * Завдяки цьому 4 промені не синхронізовані.
		 */
		const phase = x * 0.013;

		/*
		 * Повільна зміна концентрації світла.
		 *
		 * Немає різкого ON/OFF.
		 * Значення постійно плавно проходить
		 * від слабкого до сильного і назад.
		 */
		const slowWave =
			Math.sin(time * 0.11 + phase) * 0.5 +
			Math.sin(time * 0.17 + phase * 1.7) * 0.3 +
			Math.sin(time * 0.07 + phase * 2.3) * 0.2;

		const intensity = 0.55 + slowWave * 0.45;

		/*
		 * Основна маска вздовж променя.
		 *
		 * Світло не обривається.
		 * На початку та в кінці воно
		 * плавно входить/розчиняється.
		 */
		const longitudinal = ctx.createLinearGradient(100, 100, 100, beamHeight);

		longitudinal.addColorStop(0, "rgba(255,245,210,0)");

		longitudinal.addColorStop(
			0.08,
			`rgba(255,245,210,${alpha * 0.4 * intensity})`,
		);

		longitudinal.addColorStop(
			0.22,
			`rgba(255,245,210,${alpha * 0.65 * intensity})`,
		);

		longitudinal.addColorStop(0.5, `rgba(255,245,210,${alpha * intensity})`);

		longitudinal.addColorStop(
			0.72,
			`rgba(255,245,210,${alpha * 0.55 * intensity})`,
		);

		longitudinal.addColorStop(
			0.9,
			`rgba(255,245,210,${alpha * 0.18 * intensity})`,
		);

		longitudinal.addColorStop(1, "rgba(255,245,210,0)");

		/*
		 * Поперечний градієнт.
		 *
		 * Не кругла пляма.
		 * Просто м'який край витягнутого променя.
		 */
		const transverse = ctx.createLinearGradient(
			-width * 0.5,
			0,
			width * 0.5,
			0,
		);

		transverse.addColorStop(0, "rgba(255,245,210,0)");

		transverse.addColorStop(0.2, "rgba(255,245,210,0.08)");

		transverse.addColorStop(0.4, "rgba(255,245,210,0.45)");

		transverse.addColorStop(0.5, "rgba(255,245,210,0.7)");

		transverse.addColorStop(0.6, "rgba(255,245,210,0.45)");

		transverse.addColorStop(0.8, "rgba(255,245,210,0.08)");

		transverse.addColorStop(1, "rgba(255,245,210,0)");

		/*
		 * Малюємо основний витягнутий shaft.
		 */
		ctx.beginPath();

		ctx.rect(-width * 0.5, 0, width, beamHeight);

		ctx.clip();

		/*
		 * Спочатку поздовжня інтенсивність.
		 */
		ctx.fillStyle = longitudinal;
		ctx.fillRect(-width * 0.5, 0, width, beamHeight);

		/*
		 * Потім поперечна маска.
		 *
		 * multiply робить перекриття м'якшим,
		 * а не створює окрему пляму.
		 */
		ctx.globalCompositeOperation = "multiply";

		ctx.fillStyle = transverse;

		ctx.fillRect(-width * 0.5, 0, width, beamHeight);

		/*
		 * Повертаємо нормальний режим.
		 */
		ctx.globalCompositeOperation = "source-over";

		/*
		 * Основний м'який край.
		 */
		ctx.filter = "blur(14px)";

		ctx.globalAlpha = 0.8;

		ctx.fillStyle = longitudinal;

		ctx.fillRect(-width * 0.5, 0, width, beamHeight);

		/*
		 * На кінці промінь розчиняється сильніше.
		 *
		 * Не обриваємо його — просто збільшуємо blur.
		 */
		ctx.filter = "blur(30px)";

		ctx.globalAlpha = 0.35;

		ctx.fillStyle = longitudinal;

		ctx.fillRect(-width * 0.5, beamHeight * 0.35, width, beamHeight * 0.65);

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
