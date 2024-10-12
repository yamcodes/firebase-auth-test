import type { Context } from "hono";
import { z } from "zod";
import { createRoute, type OpenAPIHono } from "@hono/zod-openapi";
import type { GeneralService } from "./general.service";
import { version } from "../../../package.json";

export class GeneralController {
	constructor(
		private app: OpenAPIHono,
		private generalService: GeneralService,
	) {}

	public registerRoutes() {
		this.getHealth();
		this.getVersion();
	}

	private getHealth() {
		this.app.openapi(
			createRoute({
				method: "get",
				path: "/health",
				summary: "Get health status",
				tags: ["General"],
				responses: {
					200: {
						content: {
							"application/json": {
								schema: z.object({
									status: z.string(),
								}),
								example: { status: "OK" },
							},
						},
						description: "The service is healthy.",
					},
				},
			}),
			(c: Context) => {
				const status = this.generalService.getHealthStatus();
				return c.json({ status });
			},
		);
	}

	private getVersion() {
		this.app.openapi(
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
			(c: Context) => {
				const version = this.generalService.getVersion();
				return c.json({ version });
			},
		);
	}
}
