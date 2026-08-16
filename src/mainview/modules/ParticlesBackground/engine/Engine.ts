import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Camera } from "./Camera";
import { Config } from "./Config";
import { Mouse } from "./Mouse";
import { Renderer } from "./Renderer";
import { Time } from "./Time";
import { Wind } from "./Wind";

export class Engine {
	readonly renderer: Renderer;
	private readonly systems: System[] = [];
	private readonly context: EngineContext;
	readonly camera = new Camera();
	readonly mouse = new Mouse();
	readonly wind = new Wind();
	readonly time = new Time();

	private frame = 0;
	private lastFrameTime = 0;
	private running = false;
	private readonly mouseInfluence = 0.03;
	private readonly frameInterval = 1000 / Config.targetFps;

	constructor(canvas: HTMLCanvasElement) {
		this.renderer = new Renderer(canvas);
		this.context = {
			renderer: this.renderer,
			time: this.time,
			camera: this.camera,
			mouse: this.mouse,
			wind: this.wind,
		};

		window.addEventListener("resize", this.onResize, { passive: true });
		document.addEventListener("visibilitychange", this.onVisibilityChange);
	}

	start() {
		if (this.running) {
			return;
		}

		this.running = true;
		this.time.reset();
		this.frame = requestAnimationFrame(this.loop);
	}
	addSystem(system: System) {
		this.systems.push(system);
	}

	stop() {
		this.running = false;
		cancelAnimationFrame(this.frame);
		window.removeEventListener("resize", this.onResize);
		document.removeEventListener("visibilitychange", this.onVisibilityChange);
		this.mouse.destroy();
	}

	private readonly onResize = () => {
		this.renderer.resize();
	};

	private readonly onVisibilityChange = () => {
		if (document.hidden) {
			cancelAnimationFrame(this.frame);
			return;
		}

		if (!this.running) {
			return;
		}

		this.time.reset();
		this.lastFrameTime = 0;
		this.frame = requestAnimationFrame(this.loop);
	};

	private loop = (timestamp: number) => {
		if (!this.running || document.hidden) {
			return;
		}

		const elapsed = timestamp - this.lastFrameTime;

		if (elapsed >= this.frameInterval * 0.95) {
			this.lastFrameTime = timestamp;
			this.time.update(timestamp);
			this.update();
			this.render();
		}

		this.frame = requestAnimationFrame(this.loop);
	};

	private update() {
		this.mouse.update();

		this.camera.target.set(
			(this.mouse.position.x - this.renderer.width / 2) * this.mouseInfluence,
			(this.mouse.position.y - this.renderer.height / 2) * this.mouseInfluence,
		);

		this.camera.update();
		for (const system of this.systems) {
			system.update(this.context);
		}
	}

	private render() {
		this.renderer.clear();
		for (const system of this.systems) {
			system.render(this.context);
		}

		if (Config.debug) {
			this.renderer.drawText(`FPS: ${this.time.fps}`, 20, 30);
		}
	}
}
