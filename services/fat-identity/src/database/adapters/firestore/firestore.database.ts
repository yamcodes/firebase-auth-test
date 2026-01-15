import type { App as FirebaseApp } from "firebase-admin/app";
import { type Firestore, getFirestore } from "firebase-admin/firestore";
import type { z } from "zod";
import { initializeFirebase } from "~/config/firebase";
import { logger } from "~/utils";
import type { IDatabase } from "../../database.interface";

export class FirestoreDatabase<T extends z.ZodType>
	implements IDatabase<z.infer<T>>
{
	private app: FirebaseApp;
	private db: Firestore;

	/**
	 * @param collectionId - The collection ID is the name of the collection in the firestore database.
	 * It is used to identify the collection in the database.
	 * @param schema - The schema is the schema of the data in the collection.
	 */
	constructor(
		private collectionId: string,
		private schema: T,
	) {
		this.app = initializeFirebase();
		this.db = getFirestore(this.app);
	}

	async create(data: z.infer<T>): Promise<string> {
		const validatedData = this.schema.parse(data);
		const docRef = await this.db
			.collection(this.collectionId)
			.add(validatedData);
		return docRef.id;
	}

	async findOne(id: string): Promise<z.infer<T> | null> {
		const doc = await this.db.collection(this.collectionId).doc(id).get();
		if (!doc.exists) return null;
		const data = doc.data();
		return this.schema.parse(data);
	}

	async findAll(): Promise<Array<z.infer<T> & { id: string }>> {
		const snapshot = await this.db.collection(this.collectionId).get();
		logger.debug({ snapshot }, "Snapshot");
		return snapshot.docs.map((doc) => ({
			id: doc.id,
			...this.schema.parse(doc.data()),
		}));
	}

	async deleteAll(): Promise<number> {
		const snapshot = await this.db.collection(this.collectionId).get();
		const batch = this.db.batch();
		for (const doc of snapshot.docs) {
			batch.delete(doc.ref);
		}
		await batch.commit();
		return snapshot.size;
	}

	async deleteOne(id: string): Promise<number> {
		const doc = await this.db.collection(this.collectionId).doc(id).get();
		if (!doc.exists) return 0;
		await doc.ref.delete();
		return 1;
	}
}
