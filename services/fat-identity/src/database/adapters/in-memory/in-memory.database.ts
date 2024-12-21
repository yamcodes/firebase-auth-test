import crypto from "node:crypto";
import type { z } from "zod";
import type { IDatabase } from "../../database.interface";

export class InMemoryDatabase<T extends z.ZodType>
	implements IDatabase<z.infer<T>>
{
	private storage: Record<string, Record<string, unknown>>;

	/**
	 * @param collectionId - The ID of the collection to store the data in.
	 * @param schema - The schema to validate the data against.
	 */
	constructor(
		private collectionId: string,
		private schema: T,
	) {
		this.storage = {};
	}

	async create(data: z.infer<T>): Promise<string> {
		const validatedData = this.schema.parse(data);
		const id = crypto.randomUUID();
		if (!this.storage[this.collectionId]) {
			this.storage[this.collectionId] = {};
		}
		this.storage[this.collectionId][id] = validatedData;
		return id;
	}

	async findOne(id: string): Promise<z.infer<T> | null> {
		const data = this.storage[this.collectionId][id];
		if (!data) return null;
		return this.schema.parse(data);
	}

	async findAll(): Promise<Array<z.infer<T> & { id: string }>> {
		return Object.entries(this.storage[this.collectionId]).map(
			([id, data]) => ({
				id,
				...this.schema.parse(data),
			}),
		);
	}

	async deleteAll(): Promise<number> {
		const count = Object.keys(this.storage[this.collectionId]).length;
		this.storage[this.collectionId] = {};
		return count;
	}

	async deleteOne(id: string): Promise<number> {
		if (this.storage[this.collectionId][id]) {
			delete this.storage[this.collectionId][id];
			return 1;
		}
		return 0;
	}
}
