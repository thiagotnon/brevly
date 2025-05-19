import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { makeLeft, makeRight, type Either } from "@/shared/either";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { LinkError } from "./errors/link-error";

const createLinkInput = z.object({
	original: z.string().url(),
	shortened: z.string(),
});

type CreateLinkInput = z.input<typeof createLinkInput>;

export async function createLink(
	input: CreateLinkInput,
): Promise<Either<LinkError, { shortened: string }>> {
	const { original, shortened } = createLinkInput.parse(input);

	if (!original || !shortened) {
		return makeLeft(new LinkError("Formato de línk inválido."));
	}

	const [hasLink] = await db
		.select()
		.from(schema.links)
		.where(eq(schema.links.shortened, shortened))
		.limit(1);

	if (hasLink) {
		return makeLeft(new LinkError("Essa URL encurtada já existe."));
	}

	await db.insert(schema.links).values({
		original,
		shortened,
	});

	return makeRight({ shortened });
}
