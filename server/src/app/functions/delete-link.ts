import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { makeLeft, makeRight, type Either } from "@/shared/either";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { LinkError } from "./errors/link-error";

const deleteLinkInput = z.object({
	id: z.string(),
});

type DeleteLinkInput = z.input<typeof deleteLinkInput>;

export async function deleteLink(
	input: DeleteLinkInput,
): Promise<Either<LinkError, { id: string }>> {
	const { id } = deleteLinkInput.parse(input);

	if (!id) {
		return makeLeft(new LinkError("Link inválido."));
	}

	const [hasLink] = await db
		.select()
		.from(schema.links)
		.where(eq(schema.links.id, id));

	if (!hasLink) {
		return makeLeft(new LinkError("Link não encontrado."));
	}

	await db.delete(schema.links).where(eq(schema.links.id, id));

	return makeRight({ id });
}
