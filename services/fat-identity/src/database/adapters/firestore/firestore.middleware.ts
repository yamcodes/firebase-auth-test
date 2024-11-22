import { createDatabaseMiddleware } from "~/database/utils";
import { FirestoreDatabase } from "./firestore.database";

export const firestore = createDatabaseMiddleware(FirestoreDatabase);
