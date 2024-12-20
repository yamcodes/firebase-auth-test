import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { createApp } from "~/lib/hono";
import { logger } from "~/middleware/logger";
import { general } from "~/resources/general";
import { greetings } from "~/resources/greetings";
import { version } from "./../package.json";

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

export const routes = app.route("/greetings", greetings).route("/", general);
export type AppType = typeof routes;

// Add OpenAPI documentation endpoint
app.doc("/docs/json", {
	openapi: "3.0.0",
	info: {
		title: "fat-identity",
		description:
			"The best identity service the world has ever been graced with.",
		version,
	},
	tags: [
		{
			name: "General",
			description: "General server operations.\n\n**Prefix**: `/`",
		},
		{
			name: "Greetings",
			description: "Manage greetings.\n\n**Prefix**: `/greetings`",
		},
	],
});

app.get(
	"/",
	apiReference({
		spec: { url: "/docs/json" },
		theme: "bluePlanet",
		pageTitle: "fat-identity Docs",
	}),
);

export default app;
