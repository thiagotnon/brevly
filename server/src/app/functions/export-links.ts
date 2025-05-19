import { db, pg } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { uploadFileToStorage } from "@/infra/storage/upload-file-to-storage";
import { makeRight, type Either } from "@/shared/either";
import { stringify } from "csv-stringify";
import { ilike, or } from "drizzle-orm";
import { PassThrough, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { z } from "zod";

const exportLinksInput = z.object({
	searchQuery: z.string().optional(),
});

type ExportLinksInput = z.input<typeof exportLinksInput>;

type ExportLinksOutput = {
	reportUrl: string;
};

export async function exportLinks(
	input: ExportLinksInput,
): Promise<Either<never, ExportLinksOutput>> {
	const { searchQuery } = exportLinksInput.parse(input);

	const searchCondition = searchQuery
		? or(
				ilike(schema.links.original, `%${searchQuery}%`),
				ilike(schema.links.shortened, `%${searchQuery}%`),
			)
		: undefined;

	const { sql, params } = db
		.select({
			id: schema.links.id,
			original: schema.links.original,
			shortened: schema.links.shortened,
			createdAt: schema.links.createdAt,
			visits: schema.links.visits,
		})
		.from(schema.links)
		.where(searchCondition)
		.toSQL();

	const cursor = pg.unsafe(sql, params as string[]).cursor(50);

	const csv = stringify({
		delimiter: ",",
		header: true,
		columns: [
			{ key: "id", header: "ID" },
			{ key: "original", header: "Original URL" },
			{ key: "shortened", header: "Short URL" },
			{ key: "visits", header: "Access Count" },
			{ key: "created_at", header: "Created At" },
		],
	});

	const uploadToStorageStream = new PassThrough();

	const convertToCSVPipeline = await pipeline(
		cursor,
		new Transform({
			objectMode: true,
			transform(chunks: unknown[], encoding, callback) {
				for (const chunk of chunks) {
					this.push(chunk);
				}
				callback();
			},
		}),
		csv,
		uploadToStorageStream,
	);

	const uploadToStorage = uploadFileToStorage({
		contentType: "text/csv",
		filename: `${new Date().toISOString()}_links.csv`,
		contentStream: uploadToStorageStream,
	});

	const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline]);

	return makeRight({ reportUrl: url });
}
