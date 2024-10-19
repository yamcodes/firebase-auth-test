import { afterEach, beforeEach } from "vitest";
import { logger } from "~/utils";
import {
	DEFAULT_EMULATOR_HOST,
	DEFAULT_EMULATOR_PORT,
	DEFAULT_PROJECT_ID,
} from "../consts";

const PROJECT_ID = process.env.FIREBASE_CONFIG
	? JSON.parse(process.env.FIREBASE_CONFIG).projectId
	: DEFAULT_PROJECT_ID;
const EMULATOR_HOST = process.env.FIREBASE_EMULATOR_HOST
	? process.env.FIREBASE_EMULATOR_HOST.split(":")[0]
	: DEFAULT_EMULATOR_HOST;
const EMULATOR_PORT = process.env.FIREBASE_EMULATOR_HOST
	? process.env.FIREBASE_EMULATOR_HOST.split(":")[1]
	: DEFAULT_EMULATOR_PORT;

/**
 * Clear the database using the Firestore emulator REST endpoint
 * See: https://firebase.google.com/docs/emulator-suite/connect_firestore#clear_your_database_between_tests
 */
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

beforeEach(async () => {
	await clearDatabase();
});

afterEach(async () => {
	await clearDatabase();
});
