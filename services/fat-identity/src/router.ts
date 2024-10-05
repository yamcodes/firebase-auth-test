import { initTRPC } from "@trpc/server";
import { z } from "zod";

export const User = z.object({
	id: z.string(),
	name: z.string(),
	bio: z.string().optional(),
});
export type User = z.infer<typeof User>;
const users: Record<string, User> = {};

export const CreateUserDto = User.omit({ id: true });
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const t = initTRPC.create();
export const appRouter = t.router({
	getHello: t.procedure.query(() => {
		return "Hello World";
	}),
	getUserById: t.procedure.input(z.string()).query((opts) => {
		return users[opts.input]; // input type is string
	}),
	createUser: t.procedure.input(CreateUserDto).mutation(({ input }) => {
		const id = Date.now().toString();
		const user: User = { id, ...input };
		users[user.id] = user;
		return user;
	}),
});
// export type definition of API
export type AppRouter = typeof appRouter;
