type Mode = "idle" | "explode" | "assemble";

type Piece = {
	x: number;
	y: number;

	originX: number;
	originY: number;

	centerOffsetX: number;
	centerOffsetY: number;

	vx: number;
	vy: number;

	rotation: number;
	vr: number;

	width: number;
	height: number;

	texture: HTMLCanvasElement;
};

type Point = [number, number];

export type { Mode, Piece, Point };
