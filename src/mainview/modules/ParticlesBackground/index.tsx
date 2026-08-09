import { useEffect, useRef } from "react";
import { Config } from "./engine/Config";
import { Engine } from "./engine/Engine";
import { BokehPool } from "./particles/BokehPool";
import { ParticlePool } from "./particles/ParticlePool";
import { BokehSystem } from "./systems/BokehSystem";
import { DustSystem } from "./systems/DustSystem";
import { LightShaftSystem } from "./systems/LightShaftSystem";
import { ParticleSystem } from "./systems/ParticleSystem";

function ParticleBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		const pool = new ParticlePool(1000);
		const engine = new Engine(canvasRef.current);
		const bokehPool = new BokehPool(Config.bokeh.count);

		engine.addSystem(new LightShaftSystem());
		engine.addSystem(new DustSystem());
		engine.addSystem(new BokehSystem(bokehPool));
		engine.addSystem(new ParticleSystem(pool));

		engine.start();

		return () => engine.stop();
	}, []);

	return <canvas ref={canvasRef} className="fixed inset-0" />;
}

export { ParticleBackground };
