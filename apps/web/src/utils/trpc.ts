import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@repo/fat-identity";

export const trpc = createTRPCReact<AppRouter>();
