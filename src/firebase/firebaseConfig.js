// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
 
// 🔧 Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCUJtqpwoHCp5gePsR--fqvRdFQG0Kp0m8",
  authDomain: "digitaldocmanager.firebaseapp.com",
  projectId: "digitaldocmanager",
  storageBucket: "digitaldocmanager.firebasestorage.app",
  messagingSenderId: "160474609262",
  appId: "1:160474609262:web:08f07a167aa5e1238ad87f",
  measurementId: "G-N1MBPFN5TH"
};
 
const app = initializeApp(firebaseConfig);
 
export const storage = getStorage(app);
export const database = getDatabase(app);
export default app;