import { type FirebaseApp, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { firebaseConfig } from '../config';

interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
}

let firebaseServices: FirebaseServices | undefined;
/**
 * Get the Firebase services for the app
 */
export const getFirebase = (): FirebaseServices => {
  if (!firebaseServices) {
    const app = initializeApp(firebaseConfig);
    firebaseServices = {
      app,
      auth: getAuth(app),
    };
  }
  return firebaseServices;
};
