import { firebaseApp } from "@services/Firebase/Firebase.service";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const auth = getAuth(firebaseApp);
if (import.meta.env.DEV) {
	const token = null; // LINTODO
	connectAuthEmulator(auth, import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST);
	console.log("Auth Emulator Token:", token);
}

export { auth };
