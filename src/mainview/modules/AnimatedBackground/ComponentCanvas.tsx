import { Delaunay } from "d3-delaunay";
import React from "react";
import reactLogo from "./assets/react.svg";

type Point = [number, number];

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

const CANVAS_SIZE = 600;

const IMG_X = 100;
const IMG_Y = 100;
const IMG_W = 400;
const IMG_H = 400;

const CELL_COUNT = 1500;

const DAMPING = 0.996;

const EXPLOSION_RADIUS = 250;

export default function ExplosionCanvas() {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);

	const piecesRef = React.useRef<Piece[]>([]);
	const rafRef = React.useRef<number | null>(null);

	const explodedRef = React.useRef(false);
	const modeRef = React.useRef<"idle" | "explode" | "assemble">("idle");

	React.useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const sourceCanvas = document.createElement("canvas");
		sourceCanvas.width = IMG_W;
		sourceCanvas.height = IMG_H;

		const sourceCtx = sourceCanvas.getContext("2d");
		if (!sourceCtx) return;

		const img = new Image();

		img.onload = () => {
			sourceCtx.clearRect(0, 0, IMG_W, IMG_H);
			sourceCtx.drawImage(img, 0, 0, IMG_W, IMG_H);
			drawInitial();
		};

		img.src = reactLogo;

		function drawInitial() {
			if (!ctx) return;
			ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
			ctx.drawImage(sourceCanvas, IMG_X, IMG_Y);
		}

		function buildPieces(clickX: number, clickY: number): Piece[] {
			const points: Point[] = [];

			for (let i = 0; i < CELL_COUNT; i++) {
				points.push([Math.random() * IMG_W, Math.random() * IMG_H]);
			}

			const delaunay = Delaunay.from(points);
			const voronoi = delaunay.voronoi([0, 0, IMG_W, IMG_H]);

			const pieces: Piece[] = [];

			for (let i = 0; i < points.length; i++) {
				const polygon = [...(voronoi.cellPolygon(i) ?? [])] as Point[];

				if (polygon.length < 3) continue;

				const xs = polygon.map((p) => p[0]);
				const ys = polygon.map((p) => p[1]);

				const minX = Math.min(...xs);
				const minY = Math.min(...ys);

				const maxX = Math.max(...xs);
				const maxY = Math.max(...ys);

				const width = Math.ceil(maxX - minX);
				const height = Math.ceil(maxY - minY);

				if (width <= 0 || height <= 0) continue;

				const texture = document.createElement("canvas");

				texture.width = width;
				texture.height = height;

				const tctx = texture.getContext("2d");

				if (!tctx) continue;

				tctx.beginPath();

				polygon.forEach(([x, y], index) => {
					const px = x - minX;
					const py = y - minY;

					if (index === 0) {
						tctx.moveTo(px, py);
					} else {
						tctx.lineTo(px, py);
					}
				});

				tctx.closePath();
				tctx.clip();

				tctx.drawImage(sourceCanvas, -minX, -minY);

				const pieceX = IMG_X + minX;
				const pieceY = IMG_Y + minY;

				const centerX = pieceX + width / 2;
				const centerY = pieceY + height / 2;

				const dx = centerX - clickX;
				const dy = centerY - clickY;

				const distance = Math.hypot(dx, dy) || 1;

				const dirX = dx / distance;
				const dirY = dy / distance;

				const power = Math.max(0, 1 - distance / EXPLOSION_RADIUS);

				const force = 0.15 + Math.pow(power, 2.5) * 4;

				const randomAngle = (Math.random() - 0.5) * 0.5;

				const angle = Math.atan2(dirY, dirX) + randomAngle;

				const speed = force * (0.8 + Math.random() * 0.6);

				pieces.push({
					x: pieceX,
					y: pieceY,

					originX: pieceX,
					originY: pieceY,

					centerOffsetX: width / 2,
					centerOffsetY: height / 2,

					vx: Math.cos(angle) * speed,
					vy: Math.sin(angle) * speed,

					rotation: 0,
					vr: (Math.random() - 0.5) * 0.2,

					width,
					height,

					texture,
				});
			}

			return pieces;
		}

		function animate() {
			if (!ctx) return;
			ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

			let moving = false;

			for (const p of piecesRef.current) {
				if (modeRef.current === "explode") {
					p.x += p.vx;
					p.y += p.vy;

					p.vx *= DAMPING;
					p.vy *= DAMPING;

					p.rotation += p.vr;
					p.vr *= 0.985;

					if (Math.abs(p.vx) > 0.01 || Math.abs(p.vy) > 0.01) {
						moving = true;
					}
				}

				if (modeRef.current === "assemble") {
					const dx = p.originX - p.x;
					const dy = p.originY - p.y;

					p.x += dx * 0.08;
					p.y += dy * 0.08;

					p.rotation *= 0.92;

					if (
						Math.abs(dx) > 0.1 ||
						Math.abs(dy) > 0.1 ||
						Math.abs(p.rotation) > 0.001
					) {
						moving = true;
					} else {
						p.x = p.originX;
						p.y = p.originY;
						p.rotation = 0;
					}
				}

				ctx.save();

				ctx.translate(p.x + p.centerOffsetX, p.y + p.centerOffsetY);

				ctx.rotate(p.rotation);

				ctx.drawImage(p.texture, -p.centerOffsetX, -p.centerOffsetY);

				ctx.restore();
			}

			if (modeRef.current === "assemble" && !moving) {
				explodedRef.current = false;
				modeRef.current = "idle";

				drawInitial();
				return;
			}

			if (moving) {
				rafRef.current = requestAnimationFrame(animate);
			}
		}

		function handleClick(e: MouseEvent) {
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();

			const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;

			const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

			const inside =
				clickX >= IMG_X &&
				clickX <= IMG_X + IMG_W &&
				clickY >= IMG_Y &&
				clickY <= IMG_Y + IMG_H;

			if (!inside) return;

			if (explodedRef.current) {
				modeRef.current = "assemble";

				if (rafRef.current !== null) {
					cancelAnimationFrame(rafRef.current);
				}

				rafRef.current = requestAnimationFrame(animate);

				return;
			}

			explodedRef.current = true;

			piecesRef.current = buildPieces(clickX, clickY);

			modeRef.current = "explode";

			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}

			rafRef.current = requestAnimationFrame(animate);
		}

		canvas.addEventListener("click", handleClick);

		return () => {
			canvas.removeEventListener("click", handleClick);

			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

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
