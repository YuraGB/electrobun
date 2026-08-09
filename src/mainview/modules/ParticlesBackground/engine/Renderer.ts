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

	drawLightShaft(
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

		const gradient = this.ctx.createLinearGradient(-width / 2, 0, width / 2, 0);

		gradient.addColorStop(0.0, "rgba(255,255,255,0)");
		gradient.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
		gradient.addColorStop(1.0, "rgba(255,255,255,0)");

		this.ctx.fillStyle = gradient;

		this.ctx.fillRect(-width / 2, 0, width, height);

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
