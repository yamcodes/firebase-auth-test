import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { version } from "../../../package.json";
import { getHealthStatus, getVersion } from "./general.service";
import { createApp } from "~/lib/hono";

export const general = createApp()
	.openapi(
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
		(c) => {
			const status = getHealthStatus();
			return c.json({ status });
		},
	)
	.openapi(
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
		(c) => {
			const version = getVersion();
			return c.json({ version });
		},
	);
