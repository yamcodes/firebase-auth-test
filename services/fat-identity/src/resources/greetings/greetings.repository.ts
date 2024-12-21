import type { z } from "zod";
import type { IDatabase } from "~/database";
import type { Greeting, GreetingDto } from "./greetings.schema";

export class GreetingsRepository {
	constructor(private db: IDatabase<Greeting>) {}

	async findAll(): Promise<Greeting[]> {
		return this.db.findAll();
	}

	async findOne(id: string): Promise<Greeting | null> {
		const greeting = await this.db.findOne(id);
		return greeting ? { ...greeting, id } : null;
	}

	async create(greetingDto: z.infer<typeof GreetingDto>): Promise<Greeting> {
		const id = await this.db.create(greetingDto);
		return { ...greetingDto, id };
	}

	async deleteAll(): Promise<number> {
		return this.db.deleteAll();
	}

	async deleteOne(id: string): Promise<number> {
		return this.db.deleteOne(id);
	}
}
