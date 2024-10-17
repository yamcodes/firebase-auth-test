// See: https://hono.dev/docs/guides/rpc#ide-performance

import type { routes } from "./index";
import { hc } from "hono/client";

// assign the client to a variable to calculate the type when compiling
const client = hc<typeof routes>("");
export type Client = typeof client;

export const createClient = (...args: Parameters<typeof hc>): Client =>
	hc<typeof routes>(...args);