import type { CookieOptions } from "elysia";

export const cookie: CookieOptions = {
	secrets: "COOKiE_SECRET",
	httpOnly: true,
	expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
	secure: !process.env.NODE_ENV,
	sameSite: "none",
	//   domain: ALLOWED_ORIGINS.join(","),
};
