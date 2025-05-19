import { createLink } from "@/app/functions/create-link";
import { isLeft, unwrapEither } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/links",
		{
			schema: {
				summary: "Create a link",
				tags: ["links"],
				body: z.object({
					original: z.string().url(),
					shortened: z.string(),
				}),
				response: {
					201: z.null().describe("Link created"),
					400: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const { original, shortened } = request.body;

			if (!original || !shortened) {
				return reply.status(400).send({
					message: "Original and shortened links are required",
				});
			}

			const result = await createLink({
				original,
				shortened,
			});

			if (isLeft(result)) {
				const error = unwrapEither(result);

				switch (error.constructor.name) {
					case "LinkError":
						return reply.status(400).send({
							message: error.message,
						});
				}
			}

			return reply.status(201).send();
		},
	);
};
