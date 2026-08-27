import React from "react";
import {
	ASSEMBLE_POSITION_THRESHOLD,
	ASSEMBLE_ROTATION_THRESHOLD,
	ASSEMBLE_SPEED,
	buildPieces,
	CANVAS_SIZE,
	createImage,
	DAMPING,
	drawInitial,
	EXPLODE_ROTATION_THRESHOLD,
	EXPLODE_VELOCITY_THRESHOLD,
	IMG_H,
	IMG_W,
	IMG_X,
	IMG_Y,
	ROTATION_DAMPING,
} from "../lib";
import type { Mode, Piece } from "../types";

export const useExploude = () => {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const piecesRef = React.useRef<Piece[]>([]);
	const rafRef = React.useRef<number | null>(null);
	const modeRef = React.useRef<Mode>("idle");

	/**
	 * Becomes true after the first click.
	 *
	 * This means the second click can start
	 * assembly immediately, even while pieces
	 * are still flying apart.
	 */
	const explodedRef = React.useRef(false);

	function stopAnimation() {
		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current);

			rafRef.current = null;
		}
	}

	React.useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		const ctx = canvas.getContext("2d");

		if (!ctx) {
			return;
		}

		/**
		 * Draw pieces.
		 */
		function drawPieces() {
			if (!ctx) return;
			const pieces = piecesRef.current;

			ctx.globalAlpha = 1;

			for (let i = 0; i < pieces.length; i++) {
				const p = pieces[i];

				ctx.save();

				ctx.translate(p.x + p.centerOffsetX, p.y + p.centerOffsetY);

				ctx.rotate(p.rotation);

				ctx.drawImage(p.texture, -p.centerOffsetX, -p.centerOffsetY);

				ctx.restore();
			}
		}

		const sourceCanvas = createImage(ctx) as HTMLCanvasElement;

		function handleClick(e: MouseEvent) {
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();

			const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;

			const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

			/**
			 * ==================================
			 * SECOND CLICK
			 * ==================================
			 *
			 * This has PRIORITY over everything.
			 *
			 * It works even if particles are
			 * still flying apart.
			 */
			if (
				explodedRef.current &&
				piecesRef.current.length > 0 &&
				modeRef.current !== "assemble"
			) {
				const pieces = piecesRef.current;

				/**
				 * Immediately stop explosion.
				 */
				stopAnimation();

				/**
				 * Remove remaining explosion
				 * velocity.
				 */
				for (let i = 0; i < pieces.length; i++) {
					const p = pieces[i];

					p.vx = 0;
					p.vy = 0;
					p.vr = 0;
				}

				/**
				 * Start assembly immediately.
				 */
				modeRef.current = "assemble";

				startAnimation();

				return;
			}

			/**
			 * Ignore clicks while assembling.
			 */
			if (modeRef.current === "assemble") {
				return;
			}

			/**
			 * If pieces already exist, this is
			 * not a new explosion.
			 */
			if (piecesRef.current.length > 0 || explodedRef.current) {
				return;
			}

			/**
			 * ==================================
			 * FIRST CLICK
			 * ==================================
			 */
			if (modeRef.current !== "idle") {
				return;
			}

			/**
			 * Convert click coordinates to
			 * canvas coordinates.
			 */
			const inside =
				clickX >= IMG_X &&
				clickX <= IMG_X + IMG_W &&
				clickY >= IMG_Y &&
				clickY <= IMG_Y + IMG_H;

			if (!inside) {
				return;
			}

			/**
			 * Generate pieces.
			 */
			const pieces = buildPieces(clickX, clickY, sourceCanvas);

			if (pieces.length === 0) {
				return;
			}

			piecesRef.current = pieces;

			explodedRef.current = true;

			modeRef.current = "explode";

			stopAnimation();
			startAnimation();
		}

		function startAnimation() {
			if (rafRef.current !== null) {
				return;
			}

			rafRef.current = requestAnimationFrame(animate);
		}

		/**
		 * Main animation loop.
		 */
		function animate() {
			if (!ctx) return;
			rafRef.current = null;

			const mode = modeRef.current;

			const pieces = piecesRef.current;

			ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

			/**
			 * ==================================
			 * EXPLOSION
			 * ==================================
			 */
			if (mode === "explode") {
				let moving = false;

				for (let i = 0; i < pieces.length; i++) {
					const p = pieces[i];

					p.x += p.vx;
					p.y += p.vy;

					p.vx *= DAMPING;
					p.vy *= DAMPING;

					p.rotation += p.vr;

					p.vr *= ROTATION_DAMPING;

					/**
					 * Stop extremely small movement.
					 */
					if (Math.abs(p.vx) < EXPLODE_VELOCITY_THRESHOLD) {
						p.vx = 0;
					}

					if (Math.abs(p.vy) < EXPLODE_VELOCITY_THRESHOLD) {
						p.vy = 0;
					}

					if (Math.abs(p.vr) < EXPLODE_ROTATION_THRESHOLD) {
						p.vr = 0;
					}

					if (p.vx !== 0 || p.vy !== 0 || p.vr !== 0) {
						moving = true;
					}
				}

				drawPieces();

				/**
				 * If explosion naturally stops,
				 * simply stop RAF.
				 *
				 * The pieces remain visible and
				 * wait for the next click.
				 */
				if (!moving) {
					stopAnimation();

					return;
				}

				startAnimation();

				return;
			}

			/**
			 * ==================================
			 * ASSEMBLY
			 * ==================================
			 */
			if (mode === "assemble") {
				let moving = false;

				for (let i = 0; i < pieces.length; i++) {
					const p = pieces[i];

					const dx = p.originX - p.x;

					const dy = p.originY - p.y;

					/**
					 * Move toward original position.
					 */
					p.x += dx * ASSEMBLE_SPEED;

					p.y += dy * ASSEMBLE_SPEED;

					/**
					 * Smoothly remove rotation.
					 */
					p.rotation *= 0.92;

					/**
					 * Snap when sufficiently close.
					 */
					if (
						Math.abs(dx) > ASSEMBLE_POSITION_THRESHOLD ||
						Math.abs(dy) > ASSEMBLE_POSITION_THRESHOLD ||
						Math.abs(p.rotation) > ASSEMBLE_ROTATION_THRESHOLD
					) {
						moving = true;
					} else {
						p.x = p.originX;

						p.y = p.originY;

						p.rotation = 0;
					}
				}

				/**
				 * Draw pieces until they are
				 * completely assembled.
				 */
				drawPieces();

				/**
				 * Only after EVERY piece reaches
				 * the exact original position,
				 * replace the pieces with the
				 * original image.
				 */
				if (!moving) {
					piecesRef.current = [];

					explodedRef.current = false;

					modeRef.current = "idle";

					drawInitial(ctx, sourceCanvas);

					return;
				}

				startAnimation();

				return;
			}

			/**
			 * ==================================
			 * IDLE
			 * ==================================
			 *
			 * There are two idle situations:
			 *
			 * 1. Original image is visible.
			 * 2. Explosion is finished and pieces
			 *    are waiting for the second click.
			 */
			if (mode === "idle" && explodedRef.current && pieces.length > 0) {
				drawPieces();
			}
		}

		canvas.addEventListener("click", handleClick);

		return () => {
			canvas.removeEventListener("click", handleClick);

			stopAnimation();
		};
	}, []);

	return canvasRef;
};
