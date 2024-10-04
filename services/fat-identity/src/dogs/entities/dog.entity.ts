import z from "zod";

export const Dog = z.object({
	name: z.string(),
	breed: z.enum(["Labrador", "Corgi", "Beagle", "Golden Retriever"]),
	id: z.string(),
});

export type Dog = z.infer<typeof Dog>;
