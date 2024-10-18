import type { DatabaseInterface } from "../database";
import { type Greeting, GreetingDto, GreetingId } from "./greetings.schema";
import type { z } from "zod";

export class GreetingsRepository {
	constructor(private db: DatabaseInterface) {}

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
