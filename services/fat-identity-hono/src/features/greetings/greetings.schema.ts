import { z } from "zod";

export const GreetingDto = z.object({
	name: z
		.string({
			description: "The name of the person to greet",
		})
		.min(1, "Name is required")
		.openapi({
			examples: ["John", "Jane"],
		}),
	greeting: z
		.string()
		.min(1, "Greeting is required")
		.openapi({
			examples: ["Hello, %name!", "Welcome, %name!"],
			description: "Use %name to include the person's name in the greeting",
		}),
});

export type GreetingDto = z.infer<typeof GreetingDto>;

export const GreetingId = z
	.string()
	.min(1, "ID is required")
	.openapi({
		examples: ["123", "456"],
		description: "Unique identifier for the greeting",
	});

export const Greeting = GreetingDto.extend({
	id: GreetingId,
});

export type Greeting = z.infer<typeof Greeting>;

export const GreetingMessageResponse = z
	.object({
		message: z.string(),
	})
	.openapi({
		description: "A greeting message",
		example: { message: "Hello, John!" },
	});
