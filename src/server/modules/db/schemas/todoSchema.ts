import { relations } from "drizzle-orm/_relations";
import { boolean } from "drizzle-orm/cockroach-core";
import * as t from "drizzle-orm/pg-core";
import {
	integer,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const todoTable = pgTable(
	"todos",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		title: varchar({ length: 255 }).notNull(),
		description: text().default(""),
		completed: boolean().default(false),
		createdAt: timestamp().defaultNow().notNull(),
		updatedAt: timestamp().defaultNow().notNull(),
		userId: integer()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [t.uniqueIndex("title_idx").on(table.title)],
);

export const todosRelations = relations(todoTable, ({ one }) => ({
	user: one(user, {
		fields: [todoTable.userId],
		references: [user.id],
	}),
}));
