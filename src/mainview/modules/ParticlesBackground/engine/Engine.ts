import { EngineContext } from "../core/EngineContext";
import type { System } from "../core/System";
import { Renderer } from "./Renderer";
import { Time } from "./Time";

export class Engine {
	readonly renderer: Renderer;
	private readonly systems: System[] = [];
	private readonly context: EngineContext;

	readonly time = new Time();

	private frame = 0;

	constructor(canvas: HTMLCanvasElement) {
		this.renderer = new Renderer(canvas);
		this.context = {
			renderer: this.renderer,
			time: this.time,
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
	}

	private loop = () => {
		this.time.update();

		this.update();

		this.render();

		this.frame = requestAnimationFrame(this.loop);
	};

	private update() {
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
