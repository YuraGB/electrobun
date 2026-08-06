import { BrowserWindow, Screen, Updater } from "electrobun/bun";
import "../server/modules/app/index.ts";
import { tryCatch } from "../utils/asyncHelpers.ts";
import { logger } from "../utils/frontend_logger.ts";

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

const totalWidth = Screen.getAllDisplays()
	.map((screen) => screen.workArea)
	.reduce((acc, area) => acc + area.width, 0);

// Check if Vite dev server is running for HMR
async function getMainViewUrl(): Promise<string> {
	const channel = await Updater.localInfo.channel();
	if (channel === "dev") {
		const { error } = await tryCatch(
			async () => await fetch(DEV_SERVER_URL, { method: "HEAD" }),
		);
		if (error) {
			logger.error(
				"Vite dev server not running. Run 'bun run dev:hmr' for HMR support.",
				error,
			);
		}
		return DEV_SERVER_URL;
	}
	return "views://mainview/index.html";
}

// Create the main application window
const url = await getMainViewUrl();

const mainWindow = new BrowserWindow({
	title: "React + Tailwind + Vite!!",
	transparent: true,
	trafficLightOffset: {
		x: 100,
		y: 100,
	},
	renderer: "cef",
	url,
	frame: {
		width: 900,
		height: 700,
		x: totalWidth - 900,
		y: 0,
	},
});

logger.log("React Tailwind Vite app started!");
