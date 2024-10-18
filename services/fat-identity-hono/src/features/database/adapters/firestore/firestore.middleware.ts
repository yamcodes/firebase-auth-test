import { createMiddleware } from "hono/factory";
import type { IDatabase } from "../../database.interface";
import { FirestoreDatabase } from "./firestore.database";

export const createDatabaseMiddleware = (
	DatabaseImplementation: new () => IDatabase,
) =>
	createMiddleware(async (c, next) => {
		const db = new DatabaseImplementation();
		c.set("db", db);
		await next();
	});

export const firestore = createDatabaseMiddleware(FirestoreDatabase);
