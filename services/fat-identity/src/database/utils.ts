import { createMiddleware } from "hono/factory";
import type { IDatabase } from "./database.interface";

export const createDatabaseMiddleware = <T>(
	databaseFactory: () => IDatabase<T>,
) =>
	createMiddleware(async (c, next) => {
		const db = databaseFactory();
		c.set("db", db);
		await next();
	});
