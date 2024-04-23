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
  private unsubscribeFn: (() => void) | null = null;

  constructor() {
    const { auth } = getFirebase();
    this.auth = auth;
  }

  public subscribe(callback: (user: User | null) => void): void {
    this.unsubscribeFn = onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      callback(user);
    });
  }

  public unsubscribe(): void {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
      this.unsubscribeFn = null;
    }
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
