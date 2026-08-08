import type { Camera } from "../engine/Camera";
import type { Mouse } from "../engine/Mouse";
import type { Renderer } from "../engine/Renderer";
import type { Time } from "../engine/Time";

export interface EngineContext {
	renderer: Renderer;
	time: Time;
	camera: Camera;

	mouse: Mouse;
}
