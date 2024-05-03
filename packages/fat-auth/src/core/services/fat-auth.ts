import {
  type Auth as FirebaseAuth,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth';
import { getFirebase } from '../lib';
import type { User } from '../types';
import { loginRedirectUrl } from '../config';

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

  private redirectToLogin() {
    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(loginRedirectUrl);
    targetUrl.searchParams.set('redirect', currentUrl.href);
    window.location.href = targetUrl.href;
  }

  async loginWithAccessToken(accessToken: string) {
    const credential = GoogleAuthProvider.credential(undefined, accessToken);
    const userCredential = await signInWithCredential(this.auth, credential);
    return userCredential.user;
  }

  login() {
    this.redirectToLogin();
  }

  async logout() {
    await signOut(this.auth);
  }
}
