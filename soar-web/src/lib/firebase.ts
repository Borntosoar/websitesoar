// SOAR — Firebase auth (env-gated). Configure NEXT_PUBLIC_FIREBASE_* to go live;
// without it the auth page runs in demo mode (local validation + success).
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type Auth,
  type ConfirmationResult,
} from "firebase/auth";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseReady = Boolean(cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function authOrThrow(): Auth {
  if (!firebaseReady) throw new Error("not-configured");
  if (!app) app = getApps()[0] ?? initializeApp(cfg as Record<string, string>);
  if (!auth) auth = getAuth(app);
  return auth;
}

async function persist(a: Auth, remember: boolean) {
  await setPersistence(a, remember ? browserLocalPersistence : browserSessionPersistence);
}

export async function loginEmail(email: string, password: string, remember = true) {
  const a = authOrThrow();
  await persist(a, remember);
  return signInWithEmailAndPassword(a, email, password);
}

export async function signupEmail(email: string, password: string, remember = true) {
  const a = authOrThrow();
  await persist(a, remember);
  return createUserWithEmailAndPassword(a, email, password);
}

export async function signInGoogle() {
  return signInWithPopup(authOrThrow(), new GoogleAuthProvider());
}

export async function signInApple() {
  return signInWithPopup(authOrThrow(), new OAuthProvider("apple.com"));
}

export function makeRecaptcha(containerId: string) {
  return new RecaptchaVerifier(authOrThrow(), containerId, { size: "invisible" });
}

export async function sendOtp(phone: string, verifier: RecaptchaVerifier): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(authOrThrow(), phone, verifier);
}
