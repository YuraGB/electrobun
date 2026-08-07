import { createAuthClient } from "better-auth/react";
import { BETER_AUTH_BASE_URL } from "@/constants/shared";
export const authClient = createAuthClient({
	baseURL: BETER_AUTH_BASE_URL,
});
