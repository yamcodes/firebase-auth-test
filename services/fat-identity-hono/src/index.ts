import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { version } from "../package.json";
import { greetings } from "./features/greetings";
import { general } from "./features/general";
import { cors } from "hono/cors";
import { loggerMiddleware } from "./middleware";

const app = new OpenAPIHono();
app.use(cors());
if (import.meta.env.DEV) app.use(loggerMiddleware);
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
	"/docs",
	apiReference({
		spec: {
			url: "/openapi.json",
		},
		theme: "bluePlanet",
		pageTitle: "fat-identity Docs",
	}),
);

export default app;
