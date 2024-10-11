import { OpenAPIHono } from "@hono/zod-openapi";
import { rootRoute } from "./general";
import { sayMyNameV1Route, sayMyNameV2Route } from "./greetings";

const routes = new OpenAPIHono();

routes
	.openapi(rootRoute, (c) => c.text("Hello Hono!!"))
	.openapi(sayMyNameV1Route, async (c) => {
		const { name } = c.req.valid("query");
		return c.text(`Hello ${name}`);
	})
	.openapi(sayMyNameV2Route, async (c) => {
		const { name } = c.req.valid("query");
		return c.text(`Hello ${name}!`);
	});

export { routes };
