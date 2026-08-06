import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// @ts-ignore: side-effect import for global CSS
import "./index.css";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "../router";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
