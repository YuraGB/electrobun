import type { EngineContext } from "./EngineContext";

export interface System {
	update(context: EngineContext): void;

	render(context: EngineContext): void;
}
