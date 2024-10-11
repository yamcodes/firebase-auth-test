import { Hono } from "hono";
import { GeneralModule } from "./features/general/general.module";
import { GreetingsModule } from "./features/greetings/greetings.module";

export class AppModule {
	private app: Hono;

	constructor() {
		this.app = new Hono();
		this.setupModules();
	}

	private setupModules() {
		new GeneralModule(this.app);
		new GreetingsModule(this.app);
	}

	getApp() {
		return this.app;
	}
}
