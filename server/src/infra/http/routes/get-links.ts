import { getLinks } from "@/app/functions/get-links";
import { unwrapEither } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getLinksRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/links",
		{
			schema: {
				summary: "Get links",
				tags: ["links"],
				querystring: z.object({
					searchQuery: z.string().optional(),
					sortBy: z.enum(["createdAt"]).optional(),
					sortDirection: z.enum(["asc", "desc"]).optional(),
					page: z.coerce.number().optional().default(1),
					pageSize: z.coerce.number().optional().default(10),
				}),
				response: {
					200: z.object({
						links: z.array(
							z.object({
								id: z.string(),
								original: z.string(),
								shortened: z.string(),
								createdAt: z.date(),
								visits: z.number(),
							}),
						),
						total: z.number(),
					}),
					400: z.object({ message: z.string() }),
				},
			},
		},

		async (request, reply) => {
			const { page, pageSize, searchQuery, sortBy, sortDirection } =
				request.query;
			const result = await getLinks({
				page,
				pageSize,
				searchQuery,
				sortBy,
				sortDirection,
			});

			const { total, links } = unwrapEither(result);

			return reply.status(200).send({ total, links });
		},
	);
};
