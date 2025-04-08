import { firebaseConfig } from "@configs/Firebase.config";
import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp(firebaseConfig);

export { firebaseApp };
