import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  dogs: t.router({
    findAll: publicProcedure.output(z.array(z.object({
      name: z.string(),
      breed: z.enum(["Labrador", "Corgi", "Beagle", "Golden Retriever"]),
      id: z.string(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    create: publicProcedure.input(z.object({
      name: z.string(),
      breed: z.enum(["Labrador", "Corgi", "Beagle", "Golden Retriever"]),
      id: z.string(),
    }).omit({ id: true })).output(z.object({
      name: z.string(),
      breed: z.enum(["Labrador", "Corgi", "Beagle", "Golden Retriever"]),
      id: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

