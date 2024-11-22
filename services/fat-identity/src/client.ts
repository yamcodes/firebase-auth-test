// See: https://hono.dev/docs/guides/rpc#ide-performance

import { hc } from "hono/client";
import type { routes } from "./index";

// assign the client to a variable to calculate the type when compiling
const client = hc<typeof routes>("");
export type Client = typeof client;
export type Routes = typeof routes;

export const createClient = (...args: Parameters<typeof hc>): Client =>
	hc<typeof routes>(...args);
