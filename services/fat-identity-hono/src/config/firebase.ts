import { initializeApp, type App as FirebaseApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: FirebaseApp;

export const initializeFirebase = () => {
	if (!app) {
		app = initializeApp();
	}
	return app;
};

export const db = getFirestore(initializeFirebase());
