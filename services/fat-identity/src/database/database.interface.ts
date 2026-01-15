import type { z } from "zod";

export interface IDatabase<T> {
	create(data: Omit<T, "id">): Promise<string>;

	findOne(id: string): Promise<T | null>;

	findAll(): Promise<Array<T>>;

	deleteAll(): Promise<number>;

	deleteOne(id: string): Promise<number>;
}
