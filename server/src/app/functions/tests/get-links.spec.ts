import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { isRight, unwrapEither } from "@/shared/either";
import { makeLink } from "@/test/factories/make-links";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { beforeEach, describe, expect, it } from "vitest";
import { getLinks } from "../get-links";

beforeEach(async () => {
	await db.delete(schema.links);
});

describe("create link", () => {
	it("should be able to get links", async () => {
		await makeLink();
		await makeLink();
		await makeLink();
		await makeLink();
		await makeLink();

		const sut = await getLinks({});

		expect(isRight(sut)).toBe(true);
		expect(unwrapEither(sut).total).toEqual(sut.right?.total);
	});

	it("should be able to get paginated links", async () => {
		const link1 = await makeLink();
		const link2 = await makeLink();
		const link3 = await makeLink();
		const link4 = await makeLink();
		const link5 = await makeLink();

		const createdIds = [link1.id, link2.id, link3.id, link4.id, link5.id];

		let sut = await getLinks({
			page: 1,
			pageSize: 3,
		});

		const page1 = unwrapEither(sut).links.map((l) => l.id);
		const foundInPage1 = createdIds.filter((id) => page1.includes(id));
		expect(foundInPage1.length).toBeGreaterThan(0);

		sut = await getLinks({
			page: 2,
			pageSize: 3,
		});

		expect(isRight(sut)).toBe(true);

		const page2 = unwrapEither(sut).links.map((l) => l.id);

		const foundInPage2 = createdIds.filter((id) => page2.includes(id));
		expect(foundInPage2.length).toBeGreaterThan(0);

		const allFound = [...new Set([...foundInPage1, ...foundInPage2])];
		expect(allFound).toEqual(expect.arrayContaining(createdIds));
	});

	it("should be able to get link with search query", async () => {
		const keyword = "buscavel";
		const domain = faker.internet.domainName();

		const expected = await makeLink({
			original: `https://${keyword}.${domain}`,
			shortened: faker.word.sample(),
		});

		await makeLink();
		await makeLink();
		await makeLink();
		await makeLink();

		const sut = await getLinks({
			searchQuery: keyword,
			page: 1,
			pageSize: 10,
		});

		expect(isRight(sut)).toBe(true);
		expect(unwrapEither(sut).total).toBeGreaterThanOrEqual(1);
		expect(unwrapEither(sut).links).toEqual(
			expect.arrayContaining([expect.objectContaining({ id: expected.id })]),
		);
	});

	it("should be able to get sorted links", async () => {
		const [link1, link2, link3, link4] = await Promise.all([
			makeLink({ createdAt: new Date() }),
			makeLink({ createdAt: dayjs().subtract(1, "days").toDate() }),
			makeLink({ createdAt: dayjs().subtract(2, "days").toDate() }),
			makeLink({ createdAt: dayjs().subtract(4, "days").toDate() }),
		]);

		const allCreatedIds = [link1.id, link2.id, link3.id, link4.id];

		let sut = await getLinks({
			page: 1,
			pageSize: 10,
			sortBy: "createdAt",
			sortDirection: "asc",
		});

		expect(isRight(sut)).toBe(true);

		const ascResult = unwrapEither(sut);

		const ascSortedIds = ascResult.links
			.map((link) => link.id)
			.filter((id) => allCreatedIds.includes(id));

		expect(ascSortedIds).toEqual([link4.id, link3.id, link2.id, link1.id]);

		sut = await getLinks({
			page: 1,
			pageSize: 10,
			sortBy: "createdAt",
			sortDirection: "desc",
		});

		expect(isRight(sut)).toBe(true);

		const descResult = unwrapEither(sut);

		const descSortedIds = descResult.links
			.map((link) => link.id)
			.filter((id) => allCreatedIds.includes(id));

		expect(descSortedIds).toEqual([link1.id, link2.id, link3.id, link4.id]);
	});
});
