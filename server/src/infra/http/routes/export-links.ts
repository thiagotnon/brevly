import { exportLinks } from "@/app/functions/export-links";
import { unwrapEither } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const exportLinksRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/links/exports",
		{
			schema: {
				summary: "Export links",
				tags: ["links"],
				querystring: z.object({
					searchQuery: z.string().optional(),
				}),
				response: {
					200: z.object({
						reportUrl: z.string(),
					}),
				},
			},
		},

		async (request, reply) => {
			const { searchQuery } = request.query;
			const result = await exportLinks({
				searchQuery,
			});

			const { reportUrl } = unwrapEither(result);

			return reply.status(200).send({ reportUrl });
		},
	);
};
