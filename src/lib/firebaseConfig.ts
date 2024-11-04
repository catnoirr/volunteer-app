// src/lib/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGlBFsF_mJ7GEsYOu5p-PSVEVXUdcUlbA",
  authDomain: "myngo-15993.firebaseapp.com",
  projectId: "myngo-15993",
  storageBucket: "myngo-15993.firebasestorage.app",
  messagingSenderId: "963542477687",
  appId: "1:963542477687:web:0b49695e71d65ab7664f72",
  measurementId: "G-XXH0V04KX3"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
