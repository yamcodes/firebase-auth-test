import { type App as FirebaseApp, initializeApp } from "firebase-admin/app";
import { type Firestore, getFirestore } from "firebase-admin/firestore";
import type { z } from "zod";
import { initializeFirebase } from "~/config/firebase";
import { logger } from "~/utils";
import type { IDatabase } from "../../database.interface";

export class FirestoreDatabase implements IDatabase {
	private app: FirebaseApp;
	private db: Firestore;

	constructor() {
		this.app = initializeFirebase();
		this.db = getFirestore(this.app);
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
