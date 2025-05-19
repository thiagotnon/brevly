import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const links = pgTable("links", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	original: text("original").notNull(),
	shortened: text("shortened").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	visits: integer("visits").notNull().default(0),
});
