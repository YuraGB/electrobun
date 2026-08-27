import { Delaunay } from "d3-delaunay";
import reactLogo from "../assets/react.svg";
import type { Piece, Point } from "../types";

const CANVAS_SIZE = 600;

const IMG_X = 100;
const IMG_Y = 100;
const IMG_W = 400;
const IMG_H = 400;

const CELL_COUNT = 1000;

const DAMPING = 0.996;
const ROTATION_DAMPING = 0.985;

const EXPLOSION_RADIUS = 250;

const EXPLODE_VELOCITY_THRESHOLD = 0.01;
const EXPLODE_ROTATION_THRESHOLD = 0.001;

const ASSEMBLE_SPEED = 0.08;
const ASSEMBLE_POSITION_THRESHOLD = 0.1;
const ASSEMBLE_ROTATION_THRESHOLD = 0.001;

/**
 * Slightly enlarge every Voronoi piece.
 *
 * This is not a visible border.
 * The pieces overlap by this amount and
 * hide anti-aliased gaps between neighbors.
 */
const PIECE_BLEED = 0.7;

const createImage = (ctx?: CanvasRenderingContext2D) => {
	/**
	 * Source image.
	 */
	const sourceCanvas = document.createElement("canvas");

	sourceCanvas.width = IMG_W;
	sourceCanvas.height = IMG_H;

	const sourceCtx = sourceCanvas.getContext("2d");

	if (!sourceCtx) {
		return;
	}

	const img = new Image();

	img.onload = () => {
		sourceCtx.clearRect(0, 0, IMG_W, IMG_H);

		sourceCtx.drawImage(img, 0, 0, IMG_W, IMG_H);

		drawInitial(ctx, sourceCanvas);
	};

	img.src = reactLogo;
	return sourceCanvas;
};

/**
 * Draw the original image.
 */
function drawInitial(
	ctx?: CanvasRenderingContext2D,
	sourceCanvas?: HTMLCanvasElement,
) {
	if (!ctx || !sourceCanvas) return;
	ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

	ctx.globalAlpha = 1;

	ctx.drawImage(sourceCanvas, IMG_X, IMG_Y);
}

/**
 * Build Voronoi pieces.
 */
function buildPieces(
	clickX: number,
	clickY: number,
	sourceCanvas?: HTMLCanvasElement,
): Piece[] {
	if (!sourceCanvas) return [];
	const points: Point[] = new Array(CELL_COUNT);

	for (let i = 0; i < CELL_COUNT; i++) {
		points[i] = [Math.random() * IMG_W, Math.random() * IMG_H];
	}

	const delaunay = Delaunay.from(points);

	const voronoi = delaunay.voronoi([0, 0, IMG_W, IMG_H]);

	const pieces: Piece[] = [];

	for (let i = 0; i < points.length; i++) {
		const polygon = voronoi.cellPolygon(i);

		if (!polygon || polygon.length < 3) {
			continue;
		}

		/**
		 * Original polygon bounds.
		 */
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		for (let j = 0; j < polygon.length; j++) {
			const x = polygon[j][0];
			const y = polygon[j][1];

			if (x < minX) {
				minX = x;
			}

			if (y < minY) {
				minY = y;
			}

			if (x > maxX) {
				maxX = x;
			}

			if (y > maxY) {
				maxY = y;
			}
		}

		/**
		 * Add padding around texture.
		 *
		 * The extra padding is necessary because
		 * the polygon itself will be expanded.
		 */
		const textureMinX = minX - PIECE_BLEED;

		const textureMinY = minY - PIECE_BLEED;

		const textureMaxX = maxX + PIECE_BLEED;

		const textureMaxY = maxY + PIECE_BLEED;

		const width = Math.ceil(textureMaxX - textureMinX);

		const height = Math.ceil(textureMaxY - textureMinY);

		if (width <= 0 || height <= 0) {
			continue;
		}

		const texture = document.createElement("canvas");

		texture.width = width;
		texture.height = height;

		const textureCtx = texture.getContext("2d");

		if (!textureCtx) {
			continue;
		}

		textureCtx.imageSmoothingEnabled = true;

		/**
		 * Calculate polygon centroid.
		 *
		 * We use the centroid to push every
		 * vertex slightly outward.
		 */
		let centroidX = 0;
		let centroidY = 0;

		for (let j = 0; j < polygon.length; j++) {
			centroidX += polygon[j][0];

			centroidY += polygon[j][1];
		}

		centroidX /= polygon.length;

		centroidY /= polygon.length;

		/**
		 * Create slightly expanded polygon.
		 */
		textureCtx.beginPath();

		for (let j = 0; j < polygon.length; j++) {
			const originalX = polygon[j][0];

			const originalY = polygon[j][1];

			const dx = originalX - centroidX;

			const dy = originalY - centroidY;

			const distance = Math.hypot(dx, dy) || 1;

			const expandedX = originalX + (dx / distance) * PIECE_BLEED;

			const expandedY = originalY + (dy / distance) * PIECE_BLEED;

			/**
			 * Convert to texture coordinates.
			 */
			const x = expandedX - textureMinX;

			const y = expandedY - textureMinY;

			if (j === 0) {
				textureCtx.moveTo(x, y);
			} else {
				textureCtx.lineTo(x, y);
			}
		}

		textureCtx.closePath();

		textureCtx.clip();

		/**
		 * Draw source image into expanded
		 * texture bounds.
		 */
		textureCtx.drawImage(sourceCanvas, -textureMinX, -textureMinY);

		/**
		 * World position of texture.
		 */
		const pieceX = IMG_X + textureMinX;

		const pieceY = IMG_Y + textureMinY;

		/**
		 * Because the texture has bleed,
		 * the center is based on texture size.
		 */
		const centerOffsetX = width / 2;

		const centerOffsetY = height / 2;

		const centerX = pieceX + centerOffsetX;

		const centerY = pieceY + centerOffsetY;

		/**
		 * Explosion direction.
		 */
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

			centerOffsetX,
			centerOffsetY,

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

export {
	ASSEMBLE_POSITION_THRESHOLD,
	ASSEMBLE_ROTATION_THRESHOLD,
	ASSEMBLE_SPEED,
	buildPieces,
	CANVAS_SIZE,
	CELL_COUNT,
	createImage,
	DAMPING,
	drawInitial,
	EXPLODE_ROTATION_THRESHOLD,
	EXPLODE_VELOCITY_THRESHOLD,
	EXPLOSION_RADIUS,
	IMG_H,
	IMG_W,
	IMG_X,
	IMG_Y,
	PIECE_BLEED,
	ROTATION_DAMPING,
};
