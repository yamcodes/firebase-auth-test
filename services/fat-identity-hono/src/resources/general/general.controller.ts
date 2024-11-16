import { createRoute } from "@hono/zod-openapi";
import type { Env as HonoEnv } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { version } from "~/../package.json";
import { createApp } from "~/lib/hono";
import { GeneralService } from "./general.service";

type Env = HonoEnv & {
	Variables: {
		service: GeneralService;
	};
};

export class GeneralController {
	private general = createApp<Env>();

	constructor() {
		this.setupMiddleware();
	}

	setupMiddleware() {
		this.general.use(
			createMiddleware<Env>(async ({ var: { logger }, set }, next) => {
				const service = new GeneralService(logger);
				set("service", service);
				await next();
			}),
		);
	}

	get routes() {
		return this.general
			.route("/", this.getHealth())
			.route("/", this.getVersion());
	}

	private getHealth() {
		return this.general.openapi(
			createRoute({
				method: "get",
				path: "/health",
				summary: "Get health status",
				tags: ["General"],
				responses: {
					204: { description: "The service is healthy." },
					503: { description: "The service is unhealthy." },
				},
			}),
			({ body, var: { service } }) => {
				const isHealthy = service.getIsHealthy();
				if (!isHealthy) {
					throw new HTTPException(503);
				}
				return body(null, 204);
			},
		);
	}

	private getVersion() {
		return this.general.openapi(
			createRoute({
				method: "get",
				path: "/version",
				summary: "Get API version",
				tags: ["General"],
				responses: {
					200: {
						content: {
							"application/json": {
								schema: z.object({
									version: z.string(),
								}),
								example: { version },
							},
						},
						description:
							"The current version of the API as defined in `package.json`.",
					},
				},
			}),
			({ json, var: { service } }) => {
				const version = service.getVersion();
				return json({ version });
			},
		);
	}
}

export const { routes } = new GeneralController();
