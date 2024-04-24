import {
  type Auth as FirebaseAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirebase } from '../lib';
import type { User } from '../types';

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

  async login() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(this.auth, provider);
    return userCredential.user;
  }

  async logout() {
    await signOut(this.auth);
  }
}
