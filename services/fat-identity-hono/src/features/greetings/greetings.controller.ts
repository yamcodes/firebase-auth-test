import { createRoute, type OpenAPIHono, z } from "@hono/zod-openapi";
import { createMiddleware } from "hono/factory";
import { type IDatabase, firestore } from "~/database";
import { createApp } from "~/lib/hono";
import { GreetingsRepository } from "./greetings.repository";
import {
	Greeting,
	GreetingDto,
	GreetingId,
	GreetingMessageResponse,
} from "./greetings.schema";
import { GreetingsService } from "./greetings.service";
import type { Env as HonoEnv } from "hono";
import type { EmptyObject } from "type-fest";

type Env = HonoEnv & {
	Variables: {
		db: IDatabase;
		service: GreetingsService;
	};
};

export class GreetingsController {
	private greetings: OpenAPIHono<Env, EmptyObject, "/">;

	constructor() {
		this.greetings = createApp<Env>();
		this.setupMiddleware();
	}

	private setupMiddleware() {
		this.greetings.use(firestore);
		this.greetings.use(
			createMiddleware<Env>(async ({ var: { db, logger }, set }, next) => {
				const repo = new GreetingsRepository(db);
				const service = new GreetingsService(repo, logger);
				set("service", service);
				await next();
			}),
		);
	}

	public getRoutes() {
		return this.greetings
			.route("/", this.deleteAllGreetings())
			.route("/", this.getGoodbye())
			.route("/", this.getRandomGreeting())
			.route("/", this.postGreeting())
			.route("/", this.getAllGreetings())
			.route("/", this.getGreetingById())
			.route("/", this.getHello())
			.route("/", this.getSpecialGreeting());
	}

	private getGoodbye() {
		return this.greetings.openapi(
			createRoute({
				method: "get",
				path: "/goodbye",
				summary: "Get a goodbye message",
				description: "Retrieve a farewell message",
				tags: ["Greetings"],
				responses: {
					200: {
						content: {
							"application/json": { schema: GreetingMessageResponse },
						},
						description: "Successful response with a goodbye message",
					},
				},
			}),
			({ var: { service }, json }) => {
				const message = service.getGoodbye();
				return json({ message }, 200);
			},
		);
	}

	private getRandomGreeting() {
		return this.greetings.openapi(
			createRoute({
				method: "get",
				path: "/random/:name",
				summary: "Get a random greeting",
				description: "Retrieve a random personalized greeting",
				tags: ["Greetings"],
				request: {
					params: z.object({
						name: z
							.string()
							.min(3, "Name must be at least 3 characters long")
							.openapi({
								description: "The name of the person to greet",
								example: "John",
							}),
					}),
				},
				responses: {
					200: {
						content: {
							"application/json": { schema: GreetingMessageResponse },
						},
						description: "Successful response with a random greeting",
					},
				},
			}),
			({ var: { service }, json, req }) => {
				const { name } = req.valid("param");
				const message = service.getRandomGreeting(name);
				return json({ message }, 200);
			},
		);
	}

	private postGreeting() {
		return this.greetings.openapi(
			createRoute({
				method: "post",
				path: "/",
				summary: "Save a greeting",
				description:
					"Use this endpoint to save a new greeting. Use `%name` in the `greeting` field to include the name in the greeting.",
				tags: ["Greetings"],
				request: {
					body: {
						content: { "application/json": { schema: GreetingDto } },
					},
				},
				responses: {
					201: {
						content: { "application/json": { schema: Greeting } },
						description: "Greeting created successfully",
					},
					500: {
						description: "Server error",
						content: {
							"application/json": {
								schema: z.object({
									message: z.string(),
								}),
							},
						},
					},
				},
			}),
			async ({ var: { service }, json, req }) => {
				const greetingDto = req.valid("json");
				const result = await service.createGreeting(greetingDto);
				return json(result, 201);
			},
		);
	}

	private getAllGreetings() {
		return this.greetings.openapi(
			createRoute({
				method: "get",
				path: "/",
				summary: "Get all greetings",
				description: "Retrieve all saved greetings",
				tags: ["Greetings"],
				responses: {
					200: {
						content: { "application/json": { schema: z.array(Greeting) } },
						description: "Successfully retrieved all greetings",
					},
				},
			}),
			async ({ var: { service }, json }) => {
				const greetings = await service.getAllGreetings();
				return json(greetings);
			},
		);
	}

	private getGreetingById() {
		return this.greetings.openapi(
			createRoute({
				method: "get",
				path: "/:id",
				summary: "Get a saved greeting",
				description: "Retrieve a specific greeting by its ID",
				tags: ["Greetings"],
				request: { params: z.object({ id: GreetingId }) },
				responses: {
					200: {
						content: { "application/json": { schema: Greeting } },
						description: "Greeting retrieved successfully",
					},
					404: {
						description: "Greeting not found",
						content: {
							"application/json": { schema: z.object({ error: z.string() }) },
						},
					},
				},
			}),
			async ({ var: { service }, json, req }) => {
				const { id } = req.valid("param");
				const greeting = await service.getGreetingById(id);
				return json(greeting, 200);
			},
		);
	}

	private deleteAllGreetings() {
		return this.greetings.openapi(
			createRoute({
				method: "delete",
				path: "/all",
				summary: "Delete all greetings",
				description: "Remove all saved greetings from the database",
				tags: ["Greetings"],
				responses: {
					204: { description: "All greetings deleted successfully" },
				},
			}),
			async ({ var: { service }, body }) => {
				await service.deleteAllGreetings();
				return body(null, 204);
			},
		);
	}

	private getHello() {
		return this.greetings.openapi(
			createRoute({
				method: "get",
				path: "/hello/:name",
				summary: "Get a hello greeting",
				description: "Use this endpoint to get a personalized hello greeting",
				tags: ["Greetings"],
				request: {
					params: z.object({
						name: z.string().openapi({
							description: "The name of the person to greet",
							example: "John",
						}),
					}),
				},
				responses: {
					200: {
						content: {
							"application/json": {
								schema: GreetingMessageResponse,
							},
						},
						description: "Successful response with a greeting message",
					},
				},
			}),
			({ var: { service }, json, req }) => {
				const { name } = req.valid("param");
				const message = service.getGreeting(name);
				return json({ message }, 200);
			},
		);
	}

	private getSpecialGreeting() {
		return this.greetings.openapi(
			createRoute({
				method: "get",
				path: "/special",
				summary: "Get a special greeting",
				description: "Retrieve a unique, special greeting",
				tags: ["Greetings"],
				responses: {
					200: {
						content: {
							"application/json": { schema: GreetingMessageResponse },
						},
						description: "Successful response with a special greeting",
					},
				},
			}),
			({ var: { service }, json }) => {
				const message = service.getSpecialGreeting();
				return json({ message }, 200);
			},
		);
	}
}

// Create an instance of GreetingsRoute and export the routes
const greetingsRoute = new GreetingsController();
export const routes = greetingsRoute.getRoutes();
