import { exec } from "node:child_process";
import { promisify } from "node:util";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { db } from "~/config/firebase";
import type { Greeting } from "~/features/greetings/greetings.schema";
import { logger } from "~/utils";
import {
	DEFAULT_EMULATOR_HOST,
	DEFAULT_EMULATOR_PORT,
	DEFAULT_PROJECT_ID,
} from "./consts";

const PROJECT_ID = process.env.FIREBASE_CONFIG
	? JSON.parse(process.env.FIREBASE_CONFIG).projectId
	: DEFAULT_PROJECT_ID;
const EMULATOR_HOST = process.env.FIREBASE_EMULATOR_HOST
	? process.env.FIREBASE_EMULATOR_HOST.split(":")[0]
	: DEFAULT_EMULATOR_HOST;
const EMULATOR_PORT = process.env.FIREBASE_EMULATOR_HOST
	? process.env.FIREBASE_EMULATOR_HOST.split(":")[1]
	: DEFAULT_EMULATOR_PORT;

// biome-ignore lint/suspicious/noExplicitAny: fix l8r
let server: any;

// Function to clear data using Firestore emulator REST endpoint
const clearDatabase = async () => {
	const url = `http://${EMULATOR_HOST}:${EMULATOR_PORT}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
	try {
		const response = await fetch(url, { method: "DELETE" });
		if (!response.ok) {
			throw new Error(`Failed to clear database: ${response.statusText}`);
		}
		logger.info("Database cleared successfully");
	} catch (error) {
		logger.error("Error clearing database:", error);
		throw error;
	}
};

const execAsync = promisify(exec);

beforeAll(async () => {
	// const { stdout, stderr } = await execAsync("pnpm run emulator");
	// if (stderr) {
	// 	console.error(`Emulator stderr: ${stderr}`);
	// }
	// console.log(`Emulator stdout: ${stdout}`);
});

beforeEach(async () => {
	await clearDatabase();
});

afterEach(async () => {
	await clearDatabase();
});

afterAll(async () => {
	// await execAsync("pnpm exec firebase emulators:stop");
});
