import { FirestoreDatabase } from "./firestore.database";
import { createDatabaseMiddleware } from "~/database/utils";

export const firestore = createDatabaseMiddleware(FirestoreDatabase);
