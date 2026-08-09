export const Config = {
	background: "#111111",

	fpsLimit: 60,

	pixelRatio: Math.min(window.devicePixelRatio, 2),

	mouseLerp: 0.08,

	bloom: true,

	vignette: true,
	bokeh: {
		count: 8,
		minRadius: 30,
		maxRadius: 80,
		minAlpha: 0.03,
		maxAlpha: 0.07,
		parallax: 2.2,
	},
} as const;
