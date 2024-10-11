import type { Context } from "hono";

export class GeneralController {
	async getRoot(c: Context) {
		return c.json({ message: "Hello Hono!" });
	}
}
