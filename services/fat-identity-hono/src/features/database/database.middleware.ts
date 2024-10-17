import { createMiddleware } from "hono/factory";
import type { DatabaseInterface } from "./database.interface";
import { FirestoreDatabase } from "./firestore";

export const createDatabaseMiddleware = (
	DatabaseImplementation: new () => DatabaseInterface,
) =>
	createMiddleware(async (c, next) => {
		const db = new DatabaseImplementation();
		c.set("db", db);
		await next();
	});

export const firestore = createDatabaseMiddleware(FirestoreDatabase);
