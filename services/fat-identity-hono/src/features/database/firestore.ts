import { getFirestore, type Firestore } from "firebase-admin/firestore";
import type { DatabaseInterface } from "./database.interface";

export class FirestoreDatabase implements DatabaseInterface {
	private db: Firestore;

	constructor() {
		this.db = getFirestore();
	}

	async add(collection: string, data: any): Promise<string> {
		const docRef = await this.db.collection(collection).add(data);
		return docRef.id;
	}

	async get(collection: string, id: string): Promise<any | null> {
		const doc = await this.db.collection(collection).doc(id).get();
		return doc.exists ? doc.data() : null;
	}

	// Implement other methods as needed
}
