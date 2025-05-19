import type { FastifyInstance } from "fastify";
import { createLinkRoute } from "./create-link";
import { deleteLinkRoute } from "./delete-link";
import { exportLinksRoute } from "./export-links";
import { getLinkRoute } from "./get-link";
import { getLinksRoute } from "./get-links";

export async function appRoutes(app: FastifyInstance) {
	app.register(createLinkRoute);
	app.register(getLinksRoute);
	app.register(exportLinksRoute);
	app.register(getLinkRoute);
	app.register(deleteLinkRoute);
}
