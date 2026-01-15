import { createDatabaseMiddleware } from "~/database/utils";
import { FirestoreDatabase } from "./firestore.database";
import type { z } from "zod";

/**
 * Factory function to create a Firestore middleware for a specific collection and schema
 * @param collectionId - The name of the collection
 * @param schema - The Zod schema for the collection
 */
export const createFirestoreRepositoryMiddleware = <T extends z.ZodType>(
	collectionId: string,
	schema: T,
) =>
	createDatabaseMiddleware(() => new FirestoreDatabase(collectionId, schema));
