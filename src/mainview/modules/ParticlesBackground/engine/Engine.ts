import { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Camera } from "./Camera";
import { Mouse } from "./Mouse";
import { Renderer } from "./Renderer";
import { Time } from "./Time";

export class Engine {
	readonly renderer: Renderer;
	private readonly systems: System[] = [];
	private readonly context: EngineContext;
	readonly camera = new Camera();
	readonly mouse = new Mouse();

	readonly time = new Time();

	private frame = 0;

	constructor(canvas: HTMLCanvasElement) {
		this.renderer = new Renderer(canvas);
		this.context = {
			renderer: this.renderer,
			time: this.time,
			camera: this.camera,
			mouse: this.mouse,
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
		this.camera.target.set(
			(this.context.mouse.position.x - this.renderer.width / 2) * 0.03,

			(this.context.mouse.position.y - this.renderer.height / 2) * 0.03,
		);
		this.camera.update();
		this.mouse.update();
		for (const system of this.systems) {
			system.update(this.context);
		}
	}

	private render() {
		this.renderer.clear();

		for (const system of this.systems) {
			system.render(this.context);
		}
	}
}
