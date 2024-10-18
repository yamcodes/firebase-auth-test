import type { z } from "zod";

export interface DatabaseInterface {
	add<T extends z.ZodType>(
		collection: string,
		data: z.infer<T>,
		schema: T,
	): Promise<string>;

	get<T extends z.ZodType>(
		collection: string,
		id: string,
		schema: T,
	): Promise<z.infer<T> | null>;

	getAll<T extends z.ZodType>(
		collection: string,
		schema: T,
	): Promise<Array<z.infer<T> & { id: string }>>;

	deleteAll(collection: string): Promise<number>;
}
