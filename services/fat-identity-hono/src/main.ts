import { OpenAPIHono } from "@hono/zod-openapi";
import { AppModule } from "./app.module";
import { apiReference } from "@scalar/hono-api-reference";
import { version } from "../package.json";

const app = new OpenAPIHono();

new AppModule(app);

// Add OpenAPI documentation endpoint
app.doc("/docs", {
	openapi: "3.0.0",
	info: {
		title: "Fat Identity Hono Service",
		version,
	},
	tags: [
		{ name: "General", description: "General endpoints" },
		{ name: "Greetings", description: "Greetings endpoints" },
	],
});

app.get(
	"/reference",
	apiReference({
		spec: {
			url: "/docs",
		},
	}),
);

export default app;
