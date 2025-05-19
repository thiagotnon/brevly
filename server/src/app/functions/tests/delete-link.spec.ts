import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { isLeft, isRight } from "@/shared/either";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createLink } from "../create-link";
import { deleteLink } from "../delete-link";
import { LinkError } from "../errors/link-error";

describe("delete link", () => {
	it("should be able to delete an link", async () => {
		const shortened = faker.word.sample();
		const original = faker.internet.url();

		const newLink = await createLink({ original, shortened });
		expect(isRight(newLink)).toBe(true);

		const [link] = await db
			.select()
			.from(schema.links)
			.where(eq(schema.links.shortened, shortened));

		expect(link).toBeDefined();

		const deleted = await deleteLink({ id: link.id });
		expect(isRight(deleted)).toBe(true);

		const result = await db
			.select()
			.from(schema.links)
			.where(eq(schema.links.id, link.id));
		expect(result).toHaveLength(0);
	});

	it("should return error if link does not exist", async () => {
		const fakeId = faker.string.uuid();

		const deleteResult = await deleteLink({ id: fakeId });

		expect(isLeft(deleteResult)).toBe(true);
		if (isLeft(deleteResult)) {
			expect(deleteResult.left).toBeInstanceOf(LinkError);
			expect(deleteResult.left.message).toBe("Link não encontrado.");
		}
	});
});
