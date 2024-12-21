import { createMiddleware } from "hono/factory";
import { GreetingsService } from "./greetings.service";
import { GreetingsRepository } from "./greetings.repository";
import { createFirestoreRepositoryMiddleware } from "~/database/adapters/firestore/firestore.middleware";
import { type Greeting, GreetingDto } from "./greetings.schema";
import type { IDatabase } from "~/database";
import type { Env } from "./greetings.controller";

export const greetingsServiceMiddleware = createMiddleware<Env>(
	async ({ var: { db, logger }, set }, next) => {
		const repo = new GreetingsRepository(db);
		const service = new GreetingsService(repo, logger);
		set("service", service);
		await next();
	},
);

export const greetingsRepositoryMiddleware =
	createFirestoreRepositoryMiddleware("greetings", GreetingDto);
