import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { isRight } from "@/shared/either";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createLink } from "../create-link";
import { LinkError } from "../errors/link-error";

describe("create link", () => {
	it("should be able to create an link", async () => {
		const shortened = faker.word.sample();
		const original = faker.internet.url();

		const sut = await createLink({ original, shortened });

		expect(isRight(sut)).toBe(true);

		const result = await db
			.select()
			.from(schema.links)
			.where(eq(schema.links.shortened, shortened));

		expect(result).toHaveLength(1);
	});

	it("should not be able to create an link with an existing shortened", async () => {
		const shortened = faker.word.sample();
		const original = faker.internet.url();

		const first = await createLink({ original, shortened });
		expect(isRight(first)).toBe(true);

		const second = await createLink({ original, shortened });
		expect(isRight(second)).toBe(false);

		if (!isRight(second)) {
			expect(second.left).toBeInstanceOf(LinkError);
			expect(second.left.message).toBe("Essa URL encurtada já existe.");
		}
	});
});
