import type { OpenAPIHono } from "@hono/zod-openapi";
import { GeneralController } from "./general.controller";
import { GeneralService } from "./general.service";

export class GeneralModule {
	constructor(private app: OpenAPIHono) {
		const generalService = new GeneralService();
		const generalController = new GeneralController(this.app, generalService);
		generalController.registerRoutes();
	}
}
