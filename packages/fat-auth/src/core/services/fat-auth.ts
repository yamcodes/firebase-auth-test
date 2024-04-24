import {
  type Auth as FirebaseAuth,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { getFirebase } from '../lib';
import type { User } from '../types';

// custom errors

class NoRedirectResultError extends Error {
  constructor() {
    super('No redirect result');
  }
}

class NoCredentialError extends Error {
  constructor() {
    super('No credential');
  }
}

export class FatAuth {
  private auth: FirebaseAuth;
  public user: User | null = null;

  constructor() {
    const { auth } = getFirebase();
    this.auth = auth;
    this.subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * Subscribe to auth state changes
   * @param callback - Callback function
   * @returns Unsubscribe function
   */
  public subscribe(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      callback(user);
    });
  }

  async loginAfterRedirect() {
    const result = await getRedirectResult(this.auth);
    if (!result) throw new NoRedirectResultError();
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential) throw new NoCredentialError();
    const token = credential.accessToken;
    const user = result.user;
    return { token, user };
  }

  async login() {
    const provider = new GoogleAuthProvider();
    // const userCredential = await signInWithPopup(this.auth, provider);
    // return userCredential.user;
    await signInWithRedirect(this.auth, provider);
  }

  async logout() {
    await signOut(this.auth);
  }
}
