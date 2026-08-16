const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
	.deviceMemory;

const prefersReducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)",
).matches;

const lowPowerDevice =
	prefersReducedMotion ||
	(deviceMemory !== undefined && deviceMemory <= 4) ||
	navigator.hardwareConcurrency <= 4;

const quality = lowPowerDevice ? "low" : "high";

export const Config = {
	debug: false,
	quality,
	targetFps: lowPowerDevice ? 30 : 60,
	pixelRatio: Math.min(window.devicePixelRatio || 1, lowPowerDevice ? 1 : 1.5),
	background: "#050505",

	particles: {
		count: lowPowerDevice ? 80 : 140,
		parallaxStrength: 1,
		minRadius: 1,
		maxRadius: 7,

		largeRadiusMin: 4,
		largeRadiusMax: 7,

		minAlpha: 0.3,
		maxAlpha: 1,

		minSpeed: 0.18,
		maxSpeed: 0.72,
		drawGlows: !prefersReducedMotion,
		waveCenter: 0.64,
		waveAmplitude: 0.055,
		waveBand: 0.028,
		waveLength: 0.72,
		waveDriftSpeed: 0.075,
		waveSettle: 0.9,
	},

	dust: {
		count: lowPowerDevice ? 120 : 360,

		minRadius: 1,
		maxRadius: 2,

		minAlpha: 0.05,
		maxAlpha: 0.15,
	},

	bokeh: {
		count: lowPowerDevice ? 2 : 5,

		minRadius: 30,
		maxRadius: 80,

		minAlpha: 0.03,
		maxAlpha: 0.07,

		minSpeed: 0.08,
		maxSpeed: 0.2,
		verticalSpeed: 0.02,
		enabled: !prefersReducedMotion,
	},

	lightField: {
		x: 150,
		y: -100,
		width: 220,
		extraHeight: 200,
		length: 0.6,
	},
	lightShafts: {
		count: lowPowerDevice ? 5 : 9,

		positions: [0.15, 0.45, 0.72],
		widths: [220, 180, 260],
		alphas: [0.025, 0.018, 0.02],

		offsetY: -100,
		extraHeight: 200,
		angle: -12,

		driftSpeed: 0.08,
		driftAmount: lowPowerDevice ? 0 : 4,

		pulseSpeed: 0.12,
		pulseAmount: lowPowerDevice ? 0 : 0.03,
	},
};
