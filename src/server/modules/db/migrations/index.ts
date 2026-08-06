import { existsSync } from "node:fs";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { IS_DEV, MIGRATIONS_DIR } from "../../../../constants";
import { tryCatch } from "../../../../utils/asyncHelpers";
import { logger } from "../../../../utils/frontend_logger";
import { db } from "..";

export async function runMigrations() {
	if (!IS_DEV) {
		return;
	}

	if (!existsSync(MIGRATIONS_DIR)) {
		logger.warn(`Migrations directory not found: ${MIGRATIONS_DIR}`);
		return;
	}

	logger.info("Running migrations...");

	// cast migrate to any to satisfy overload mismatch between packages
	const { error } = await tryCatch(
		async () =>
			await (migrate as any)(
				db,
				{
					migrationsFolder: MIGRATIONS_DIR,
				},
				{},
			),
	);

	if (error) {
		logger.error("Migration failed:", error);
		return;
	}

	logger.info("Migrations completed.");
}
