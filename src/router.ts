import { createMemoryHistory, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

function getInitialRoute() {
	if (typeof window === "undefined") {
		return;
	}

	const { hash, pathname, protocol, search } = window.location;

	if (protocol !== "views:" && !pathname.endsWith("/index.html")) {
		return;
	}

	const routePath = pathname.endsWith("/index.html") ? "/" : pathname || "/";

	return `${routePath}${search}${hash}`;
}

const initialRoute = getInitialRoute();
const history = initialRoute
	? createMemoryHistory({ initialEntries: [initialRoute] })
	: undefined;

export const router = createRouter({
	routeTree,
	...(history ? { history } : {}),
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
