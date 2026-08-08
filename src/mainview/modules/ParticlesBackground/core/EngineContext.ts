import { Renderer } from "../engine/Renderer";
import { Time } from "../engine/Time";

export interface EngineContext {
	renderer: Renderer;
	time: Time;
}
