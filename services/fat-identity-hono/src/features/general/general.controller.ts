import type { Context } from "hono";
import { z } from "zod";
import { createRoute, type OpenAPIHono } from "@hono/zod-openapi";

export class GeneralController {
	constructor(private app: OpenAPIHono) {}

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
						description: "Successful response",
					},
				},
			}),
			(c) => {
				return c.json({ status: "OK" });
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
								example: { version: "1.0.0" },
							},
						},
						description: "Successful response",
					},
				},
			}),
			(c) => {
				return c.json({ version: "1.0.0" });
			},
		);
	}
}
