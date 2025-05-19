import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { makeLeft, makeRight, type Either } from "@/shared/either";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { LinkError } from "./errors/link-error";

const getLinkInput = z.object({
	shortened: z.string(),
});

type GetLinkInput = z.input<typeof getLinkInput>;

type GetLinkOutput = {
	original: string;
};

export async function getLink(
	input: GetLinkInput,
): Promise<Either<LinkError, GetLinkOutput>> {
	const { shortened } = getLinkInput.parse(input);

	const [link] = await db
		.select({
			original: schema.links.original,
			shortened: schema.links.shortened,
		})
		.from(schema.links)
		.where(eq(schema.links.shortened, shortened));

	if (!link) {
		return makeLeft(new LinkError("Link não encontrado."));
	}

	await db
		.update(schema.links)
		.set({ visits: sql`${schema.links.visits} + 1` })
		.where(eq(schema.links.shortened, link.shortened));

	return makeRight(link);
}
