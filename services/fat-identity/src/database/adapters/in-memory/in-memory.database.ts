import crypto from "node:crypto";
import type { z } from "zod";
import type { IDatabase } from "../../database.interface";

export class InMemoryDatabase implements IDatabase {
	private storage: Record<string, Record<string, unknown>>;

	constructor() {
		this.storage = {};
	}

	async create<T extends z.ZodType>(
		collection: string,
		data: z.infer<T>,
		schema: T,
	): Promise<string> {
		const validatedData = schema.parse(data);
		const id = crypto.randomUUID();
		if (!this.storage[collection]) {
			this.storage[collection] = {};
		}
		this.storage[collection][id] = validatedData;
		return id;
	}

	async findOne<T extends z.ZodType>(
		collection: string,
		id: string,
		schema: T,
	): Promise<z.infer<T> | null> {
		const data = this.storage[collection]?.[id];
		if (!data) return null;
		return schema.parse(data);
	}

	async findAll<T extends z.ZodType>(
		collection: string,
		schema: T,
	): Promise<Array<z.infer<T> & { id: string }>> {
		const collectionData = this.storage[collection] || {};
		return Object.entries(collectionData).map(([id, data]) => ({
			id,
			...schema.parse(data),
		}));
	}

	async deleteAll(collection: string): Promise<number> {
		const count = Object.keys(this.storage[collection] || {}).length;
		delete this.storage[collection];
		return count;
	}

	/**
	 * Delete a single item from the collection.
	 * @param collection - The collection to delete the item from
	 * @param id - The ID of the item to delete
	 * @returns 1 if the item was deleted, 0 if it did not exist
	 */
	async deleteOne(collection: string, id: string): Promise<number> {
		if (this.storage[collection]?.[id]) {
			delete this.storage[collection][id];
			return 1;
		}
		return 0;
	}
}
