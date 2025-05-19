import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { makeRight, type Either } from "@/shared/either";
import { asc, count, desc, ilike, or } from "drizzle-orm";
import { z } from "zod";

const getLinksInput = z.object({
	searchQuery: z.string().optional(),
	sortBy: z.enum(["createdAt"]).optional(),
	sortDirection: z.enum(["asc", "desc"]).optional(),
	page: z.number().optional().default(1),
	pageSize: z.number().optional().default(10),
});

type GetLinksInput = z.input<typeof getLinksInput>;

type GetLinksOutput = {
	links: Array<{
		id: string;
		original: string;
		shortened: string;
		createdAt: Date;
		visits: number;
	}>;
	total: number;
};

export async function getLinks(
	input: GetLinksInput,
): Promise<Either<never, GetLinksOutput>> {
	const { page, pageSize, searchQuery, sortBy, sortDirection } =
		getLinksInput.parse(input);

	const searchCondition = searchQuery
		? or(
				ilike(schema.links.original, `%${searchQuery}%`),
				ilike(schema.links.shortened, `%${searchQuery}%`),
			)
		: undefined;

	const [links, [{ total }]] = await Promise.all([
		db
			.select({
				id: schema.links.id,
				original: schema.links.original,
				shortened: schema.links.shortened,
				createdAt: schema.links.createdAt,
				visits: schema.links.visits,
			})
			.from(schema.links)
			.where(searchCondition)
			.orderBy((fields) => {
				if (sortBy && sortDirection === "asc") {
					return asc(fields[sortBy]);
				}
				if (sortBy && sortDirection === "desc") {
					return desc(fields[sortBy]);
				}

				return desc(fields.id);
			})
			.offset((page - 1) * pageSize)
			.limit(pageSize),

		db
			.select({ total: count(schema.links.id) })
			.from(schema.links)
			.where(searchCondition),
	]);

	return makeRight({ links, total });
}
