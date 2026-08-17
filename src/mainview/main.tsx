import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { RouterProvider } from "@tanstack/react-router";
import { logger } from "@/utils/frontend_logger";
import { router } from "../router";

const mainContainer = document.getElementById("root");

if (mainContainer === null) {
	logger.error("There is no root component");
	throw new Error("There is no root component");
}

createRoot(mainContainer).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
