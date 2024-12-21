import crypto from "node:crypto";
import type { z } from "zod";
import type { IDatabase } from "../../database.interface";

export class InMemoryDatabase<T extends z.ZodType>
	implements IDatabase<z.infer<T>>
{
	private storage: Record<string, Record<string, unknown>>;

	constructor(private schema: T) {
		this.storage = {};
	}

	async create(data: z.infer<T>): Promise<string> {
		const validatedData = this.schema.parse(data);
		const id = crypto.randomUUID();
		if (!this.storage[id]) {
			this.storage[id] = {};
		}
		this.storage[id] = validatedData;
		return id;
	}

	async findOne(id: string): Promise<z.infer<T> | null> {
		const data = this.storage[id];
		if (!data) return null;
		return this.schema.parse(data);
	}

	async findAll(): Promise<Array<z.infer<T> & { id: string }>> {
		return Object.entries(this.storage).map(([id, data]) => ({
			id,
			...this.schema.parse(data),
		}));
	}

	async deleteAll(): Promise<number> {
		const count = Object.keys(this.storage).length;
		this.storage = {};
		return count;
	}

	async deleteOne(id: string): Promise<number> {
		if (this.storage[id]) {
			delete this.storage[id];
			return 1;
		}
		return 0;
	}
}
