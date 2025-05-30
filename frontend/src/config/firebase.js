import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  privateKey: import.meta.env.VITE_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  clientEmail: import.meta.env.VITE_FIREBASE_CLIENT_EMAIL,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);