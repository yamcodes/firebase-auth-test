import type { Context } from "hono";

export class GreetingsController {
	async getGreeting(c: Context) {
		const name = c.req.param("name");
		return c.json({ message: `Hello, ${name}!` });
	}
}
