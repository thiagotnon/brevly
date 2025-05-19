import { env } from "@/env";
import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";
import { Readable } from "node:stream";
import { z } from "zod";
import { r2 } from "./client";

const uploadFileToStorageInput = z.object({
	filename: z.string(),
	contentType: z.string(),
	contentStream: z.instanceof(Readable),
});

type UploadFileToStorageInput = z.input<typeof uploadFileToStorageInput>;

export async function uploadFileToStorage(input: UploadFileToStorageInput) {
	const { filename, contentStream, contentType } =
		uploadFileToStorageInput.parse(input);

	const fileExtension = extname(filename);
	const fileNameWithoutExtension = basename(filename);
	const sanitizedFileName = fileNameWithoutExtension.replace(
		/[^a-zA-Z0-9]/g,
		"",
	);
	const sanitizedFileNameWithExtension =
		sanitizedFileName.concat(fileExtension);

	const uniqueFileName = `downloads/${randomUUID()}-${sanitizedFileNameWithExtension}`;

	const upload = new Upload({
		client: r2,
		params: {
			Key: uniqueFileName,
			Bucket: env.CLOUDFLARE_BUCKET,
			Body: contentStream,
			ContentType: contentType,
		},
	});

	await upload.done();

	return {
		key: uniqueFileName,
		url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_URL).toString(),
	};
}
