export const Config = {
	pixelRatio: window.devicePixelRatio,
	background: "#050505",

	particles: {
		count: 120,
		parallaxStrength: 1,
		minRadius: 1,
		maxRadius: 7,

		largeRadiusMin: 4,
		largeRadiusMax: 7,

		minAlpha: 0.3,
		maxAlpha: 1,

		minSpeed: 1,
		maxSpeed: 3,
	},

	dust: {
		count: 180,

		minRadius: 1,
		maxRadius: 2,

		minAlpha: 0.05,
		maxAlpha: 0.15,
	},

	bokeh: {
		count: 6,

		minRadius: 30,
		maxRadius: 80,

		minAlpha: 0.03,
		maxAlpha: 0.07,

		minSpeed: 0.08,
		maxSpeed: 0.2,
		verticalSpeed: 0.02,
	},

	lightField: {
		x: 150,
		y: -100,
		width: 220,
		extraHeight: 200,
		length: 0.6,
	},
	lightShafts: {
		count: 3,

		positions: [0.15, 0.45, 0.72],
		widths: [220, 180, 260],
		alphas: [0.025, 0.018, 0.02],

		offsetY: -100,
		extraHeight: 200,
		angle: -12,

		driftSpeed: 0.08,
		driftAmount: 4,

		pulseSpeed: 0.12,
		pulseAmount: 0.03,
	},
};
