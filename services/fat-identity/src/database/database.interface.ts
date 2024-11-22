import type { z } from "zod";

export interface IDatabase {
	create<T extends z.ZodType>(
		collection: string,
		data: z.infer<T>,
		schema: T,
	): Promise<string>;

	findOne<T extends z.ZodType>(
		collection: string,
		id: string,
		schema: T,
	): Promise<z.infer<T> | null>;

	findAll<T extends z.ZodType>(
		collection: string,
		schema: T,
	): Promise<Array<z.infer<T> & { id: string }>>;

	deleteAll(collection: string): Promise<number>;

	deleteOne<T extends z.ZodType>(
		collection: string,
		id: string,
	): Promise<number>;
}
