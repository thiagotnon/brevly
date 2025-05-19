import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { fakerPT_BR as faker } from "@faker-js/faker";
import type { InferInsertModel } from "drizzle-orm";

export async function makeLink(
	overrides?: Partial<InferInsertModel<typeof schema.links>>,
) {
	const result = await db
		.insert(schema.links)
		.values({
			original: faker.internet.url(),
			shortened: faker.word.sample(),
			...overrides,
		})
		.returning();

	return result[0];
}
