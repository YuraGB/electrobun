import { drizzle } from "drizzle-orm/neon-http";
import { DB_URL } from "../../../constants";
export const db = drizzle(DB_URL);
