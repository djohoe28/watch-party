import { initializeApp } from "firebase/app";
import firebaseConfig from "../configs/Firebase.config";

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
