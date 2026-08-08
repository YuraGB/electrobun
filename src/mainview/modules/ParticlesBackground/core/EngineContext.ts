import type { Camera } from "../engine/Camera";
import type { Mouse } from "../engine/Mouse";
import type { Renderer } from "../engine/Renderer";
import type { Time } from "../engine/Time";
import type { Wind } from "../engine/Wind";

export interface EngineContext {
	renderer: Renderer;
	time: Time;
	camera: Camera;
	wind: Wind;
	mouse: Mouse;
}
