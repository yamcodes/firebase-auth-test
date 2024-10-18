import { createMiddleware } from "hono/factory";
import { Container } from "~/di/container";

export const injectRepositories = createMiddleware(async (c, next) => {
	const container = Container.getInstance();
	c.set("greetingsRepository", container.getGreetingsRepository());
	await next();
});
