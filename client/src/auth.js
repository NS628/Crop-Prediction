import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, firebaseConfigured } from "./firebase.js";

export async function signInWithGoogle() {
  if (!firebaseConfigured) throw new Error("Firebase is not configured. Add the VITE_FIREBASE_* values to client/.env.");
  return signInWithPopup(auth, googleProvider);
}
export async function signOutUser() {
  if (!firebaseConfigured) return;
  return signOut(auth);
}
