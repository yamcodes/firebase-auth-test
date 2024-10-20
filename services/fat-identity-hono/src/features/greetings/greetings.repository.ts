import type { z } from "zod";
import type { IDatabase } from "~/database";
import { type Greeting, GreetingDto } from "./greetings.schema";

export class GreetingsRepository {
	constructor(private db: IDatabase) {}

	async getAllGreetings(): Promise<Greeting[]> {
		return this.db.getAll("greetings", GreetingDto);
	}

	async getGreetingById(id: string): Promise<Greeting | null> {
		const greeting = await this.db.get("greetings", id, GreetingDto);
		return greeting ? { ...greeting, id } : null;
	}

	async createGreeting(
		greetingDto: z.infer<typeof GreetingDto>,
	): Promise<Greeting> {
		const id = await this.db.add("greetings", greetingDto, GreetingDto);
		return { ...greetingDto, id };
	}

	async deleteAllGreetings(): Promise<number> {
		return this.db.deleteAll("greetings");
	}
}
