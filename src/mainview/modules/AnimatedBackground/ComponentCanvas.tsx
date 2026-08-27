import { useExploude } from "./hooks/useExploude";
import { CANVAS_SIZE } from "./lib";

export default function ExplosionCanvas() {
	const canvasRef = useExploude();
	return (
		<canvas
			ref={canvasRef}
			width={CANVAS_SIZE}
			height={CANVAS_SIZE}
			style={{
				border: "1px solid gray",
				cursor: "pointer",
				display: "block",
			}}
		/>
	);
}
