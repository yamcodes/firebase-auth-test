import type { OpenAPIHono } from "@hono/zod-openapi";
import { GeneralController } from "./general.controller";

export class GeneralModule {
	constructor(app: OpenAPIHono) {
		const generalController = new GeneralController();
		app.get("/", generalController.getRoot);
	}
}
