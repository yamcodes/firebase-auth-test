import type { ValidationTargets } from "hono";
import type { ZodError } from "zod";

export function formatZodErrors(
	result: { target: keyof ValidationTargets } & {
		success: false;
		error: ZodError;
	},
): { path: string; message: string }[] {
	return result.error.errors.map((error) => ({
		path: error.path.join("."),
		message: error.message,
	}));
}
