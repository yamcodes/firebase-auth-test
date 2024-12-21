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
	private collectionName: string;
	private schema: T;

	constructor(collectionName: string, schema: T) {
		this.app = initializeFirebase();
		this.db = getFirestore(this.app);
		this.collectionName = collectionName;
		this.schema = schema;
	}

	async create(data: z.infer<T>): Promise<string> {
		const validatedData = this.schema.parse(data);
		const docRef = await this.db
			.collection(this.collectionName)
			.add(validatedData);
		return docRef.id;
	}

	async findOne(id: string): Promise<z.infer<T> | null> {
		const doc = await this.db.collection(this.collectionName).doc(id).get();
		if (!doc.exists) return null;
		const data = doc.data();
		return this.schema.parse(data);
	}

	async findAll(): Promise<Array<z.infer<T> & { id: string }>> {
		try {
			const snapshot = await this.db.collection(this.collectionName).get();
			logger.debug({ snapshot }, "Snapshot");
			return snapshot.docs.map((doc) => ({
				id: doc.id,
				...this.schema.parse(doc.data()),
			}));
		} catch (error) {
			logger.error(error, "Error fetching all documents");
			throw error;
		}
	}

	async deleteAll(): Promise<number> {
		const snapshot = await this.db.collection(this.collectionName).get();
		const batch = this.db.batch();
		for (const doc of snapshot.docs) {
			batch.delete(doc.ref);
		}
		await batch.commit();
		return snapshot.size;
	}

	async deleteOne(id: string): Promise<number> {
		const doc = await this.db.collection(this.collectionName).doc(id).get();
		if (!doc.exists) return 0;
		await doc.ref.delete();
		return 1;
	}
}
