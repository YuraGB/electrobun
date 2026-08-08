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

	drawCircle(x: number, y: number, radius: number, color = "#fff", alpha = 1) {
		this.ctx.save();

		this.ctx.globalAlpha = alpha;

		this.ctx.beginPath();

		this.ctx.arc(x, y, radius, 0, Math.PI * 2);

		this.ctx.fillStyle = color;

		this.ctx.fill();

		this.ctx.restore();
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

	clear() {
		this.ctx.fillStyle = Config.background;

		this.ctx.fillRect(0, 0, this.width, this.height);
	}
}
