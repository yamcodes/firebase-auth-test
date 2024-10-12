import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { version } from "../package.json";
import { general } from "./features/general";
import { greetings } from "./features/greetings";
import { logger } from "./middleware/logger";

const app = new OpenAPIHono();
app.use(cors());

// Use the logger middleware with options
app.use(logger({ logIncoming: import.meta.env.DEV }));

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
