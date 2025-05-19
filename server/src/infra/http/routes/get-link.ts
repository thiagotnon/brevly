import { getLink } from "@/app/functions/get-link";
import { isRight, unwrapEither } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getLinkRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/links/:shortened",
		{
			schema: {
				summary: "Get link",
				tags: ["links"],
				params: z.object({
					shortened: z.string(),
				}),
				response: {
					200: z.object({
						original: z.string(),
					}),
					400: z.object({ message: z.string() }),
				},
			},
		},

		async (request, reply) => {
			const { shortened } = request.params;

			const result = await getLink({ shortened });

			if (isRight(result)) {
				const { original } = unwrapEither(result);

				return reply.status(200).send({
					original,
				});
			}

			const error = unwrapEither(result);

			switch (error.constructor.name) {
				case "LinkError":
					return reply.status(400).send({
						message: error.message,
					});
			}
		},
	);
};
