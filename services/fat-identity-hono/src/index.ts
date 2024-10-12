import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { version } from "../package.json";
import { general } from "./features/general";
import { greetings } from "./features/greetings";
import { logger } from "~/middleware/logger";
import { HTTPException } from "hono/http-exception";
import { createApp } from "~/lib/hono";

const app = createApp();
app.use(cors());

app.use(logger({ logIncoming: import.meta.env.DEV }));

app.onError((err, { json, var: { logger } }) => {
	if (err instanceof HTTPException) return err.getResponse();

	// Unknown error flow

	logger.error(err);
	throw new HTTPException(500, {
		message: "Unexpected server error",
		cause: err,
		res: import.meta.env.DEV
			? json({
					error: "Unexpected server error",
					message: err.message,
					stack: err.stack,
				})
			: undefined,
	});
});

const routes = app.route("/greetings", greetings).route("/", general);
export type AppType = typeof routes;

// Add OpenAPI documentation endpoint
app.doc("/openapi.json", {
	openapi: "3.0.0",
	info: {
		title: "fat-identity Docs",
		version,
	},
	tags: [
		{ name: "General", description: "General endpoints" },
		{ name: "Greetings", description: "Greetings endpoints" },
	],
});

app.get(
	"/",
	apiReference({
		spec: {
			url: "/openapi.json",
		},
		theme: "bluePlanet",
		pageTitle: "fat-identity Docs",
	}),
);

export default app;
