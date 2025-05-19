import * as upload from "@/infra/storage/upload-file-to-storage";
import { isRight, unwrapEither } from "@/shared/either";
import { makeLink } from "@/test/factories/make-links";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { exportLinks } from "../export-links";

describe("export links", () => {
	it("should be able to export links", async () => {
		const linkstub = vi
			.spyOn(upload, "uploadFileToStorage")
			.mockImplementationOnce(async () => {
				return {
					key: `${randomUUID()}.csv`,
					url: "http://example.com/file.csv",
				};
			});

		const namePattern = faker.internet.url();

		const link1 = await makeLink({ original: namePattern });
		const link2 = await makeLink({ original: namePattern });
		const link3 = await makeLink({ original: namePattern });
		const link4 = await makeLink({ original: namePattern });
		const link5 = await makeLink({ original: namePattern });

		const sut = await exportLinks({
			searchQuery: namePattern,
		});

		const generatedCSVStream = linkstub.mock.calls[0][0].contentStream;
		const csvAsString = await new Promise<string>((resolve, reject) => {
			const chunks: Buffer[] = [];

			generatedCSVStream.on("data", (chunk: Buffer) => {
				chunks.push(chunk);
			});

			generatedCSVStream.on("end", () => {
				resolve(Buffer.concat(chunks).toString("utf-8"));
			});

			generatedCSVStream.on("error", (err) => {
				reject(err);
			});
		});

		const csvAsArray = csvAsString
			.trim()
			.split("\n")
			.map((row) => row.split(","));

		expect(isRight(sut)).toBe(true);
		expect(unwrapEither(sut).reportUrl).toBe("http://example.com/file.csv");
		expect(csvAsArray).toEqual([
			["ID", "Original URL", "Short URL", "Access Count", "Created At"],
			[
				link1.id,
				link1.original,
				link1.shortened,
				String(link1.visits),
				expect.any(String),
			],
			[
				link2.id,
				link2.original,
				link2.shortened,
				String(link2.visits),
				expect.any(String),
			],
			[
				link3.id,
				link3.original,
				link3.shortened,
				String(link3.visits),
				expect.any(String),
			],
			[
				link4.id,
				link4.original,
				link4.shortened,
				String(link4.visits),
				expect.any(String),
			],
			[
				link5.id,
				link5.original,
				link5.shortened,
				String(link5.visits),
				expect.any(String),
			],
		]);
	});
});
