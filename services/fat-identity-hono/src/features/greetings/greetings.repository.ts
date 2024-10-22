import type { z } from "zod";
import type { IDatabase } from "~/database";
import { type Greeting, GreetingDto } from "./greetings.schema";

export class GreetingsRepository {
	constructor(private db: IDatabase) {}

	async findAll(): Promise<Greeting[]> {
		return this.db.findAll("greetings", GreetingDto);
	}

	async findOne(id: string): Promise<Greeting | null> {
		const greeting = await this.db.findOne("greetings", id, GreetingDto);
		return greeting ? { ...greeting, id } : null;
	}

	async create(greetingDto: z.infer<typeof GreetingDto>): Promise<Greeting> {
		const id = await this.db.create("greetings", greetingDto, GreetingDto);
		return { ...greetingDto, id };
	}

	async deleteAll(): Promise<number> {
		return this.db.deleteAll("greetings");
	}

	/**
	 * Delete a single greeting by ID and return the number of deleted documents
	 */
	async deleteOne(id: string): Promise<number> {
		return this.db.deleteOne("greetings", id);
	}
}
