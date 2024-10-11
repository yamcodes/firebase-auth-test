import type { Hono } from "hono";
import { GeneralController } from "./general.controller";

export class GeneralModule {
	constructor(app: Hono) {
		const generalController = new GeneralController();
		app.get("/", generalController.getRoot);
	}
}
