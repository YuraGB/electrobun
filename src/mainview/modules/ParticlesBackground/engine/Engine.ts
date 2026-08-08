import type { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Camera } from "./Camera";
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
	private readonly mouseInfluence = 0.03;

	constructor(canvas: HTMLCanvasElement) {
		this.renderer = new Renderer(canvas);
		this.context = {
			renderer: this.renderer,
			time: this.time,
			camera: this.camera,
			mouse: this.mouse,
			wind: this.wind,
		};

		window.addEventListener("resize", () => this.renderer.resize());
	}

	start() {
		this.loop();
	}
	addSystem(system: System) {
		this.systems.push(system);
	}

	stop() {
		cancelAnimationFrame(this.frame);
		this.mouse.destroy();
	}

	private loop = () => {
		this.time.update();

		this.update();

		this.render();

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
		this.renderer.drawText(`FPS: ${this.time.fps}`, 20, 30);
	}
}
