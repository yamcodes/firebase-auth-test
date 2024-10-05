import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../../services/fat-identity-nestjs/src/@generated/server";

export const trpc = createTRPCReact<AppRouter>();
