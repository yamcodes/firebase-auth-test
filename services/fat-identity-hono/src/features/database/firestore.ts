import { type Firestore, getFirestore } from "firebase-admin/firestore";
import type { z } from "zod";
import type { DatabaseInterface } from "./database.interface";
import { logger } from "~/utils";

export class FirestoreDatabase implements DatabaseInterface {
	private db: Firestore;

	constructor() {
		this.db = getFirestore();
	}

	async add<T extends z.ZodType>(
		collection: string,
		data: z.infer<T>,
		schema: T,
	): Promise<string> {
		const validatedData = schema.parse(data);
		const docRef = await this.db.collection(collection).add(validatedData);
		return docRef.id;
	}

	async get<T extends z.ZodType>(
		collection: string,
		id: string,
		schema: T,
	): Promise<z.infer<T> | null> {
		const doc = await this.db.collection(collection).doc(id).get();
		if (!doc.exists) return null;
		const data = doc.data();
		return schema.parse(data);
	}

	async getAll<T extends z.ZodType>(
		collection: string,
		schema: T,
	): Promise<Array<z.infer<T> & { id: string }>> {
		const snapshot = await this.db.collection(collection).get();
		logger.debug({ snapshot }, "Snapshot");
		return snapshot.docs.map((doc) => ({
			id: doc.id,
			...schema.parse(doc.data()),
		}));
	}

	async deleteAll(collection: string): Promise<number> {
		const snapshot = await this.db.collection(collection).get();
		const batch = this.db.batch();
		for (const doc of snapshot.docs) {
			batch.delete(doc.ref);
		}
		await batch.commit();
		return snapshot.size;
	}
}
