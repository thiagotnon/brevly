import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { isLeft, isRight } from "@/shared/either";
import { makeLink } from "@/test/factories/make-links";
import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, it } from "vitest";
import { getLink } from "../get-link";

beforeEach(async () => {
	await db.delete(schema.links);
});

describe("get link", () => {
	it("should be able to get link by shortened", async () => {
		const link = await makeLink({});

		const sut = await getLink({ shortened: link.shortened });

		expect(isRight(sut)).toBe(true);
		expect(sut.right?.original).toEqual(link.original);
	});

	it("should not be able to get link with invalid shortened", async () => {
		const shortened = faker.word.sample();
		const sut = await getLink({ shortened });

		expect(isLeft(sut)).toBe(true);
		expect(sut.left?.message).toEqual("Link não encontrado.");
	});
});
