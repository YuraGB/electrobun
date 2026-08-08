import { useEffect, useRef } from "react";
import { Engine } from "./engine/Engine";
import { ParticlePool } from "./particles/ParticlePool";
import { DustSystem } from "./systems/DustSystem";
// import { DebugSystem } from "./systems/DebugSystem";
import { ParticleSystem } from "./systems/ParticleSystem";

function ParticleBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		const pool = new ParticlePool(1000);
		const engine = new Engine(canvasRef.current);
		engine.addSystem(new DustSystem());
		engine.addSystem(new ParticleSystem(pool));

		engine.start();

		return () => engine.stop();
	}, []);

	return <canvas ref={canvasRef} className="fixed inset-0" />;
}

export { ParticleBackground };
