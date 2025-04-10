import { firebaseApp } from "@services/Firebase.service";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const auth = getAuth(firebaseApp);
if (import.meta.env.DEV) {
	const token = connectAuthEmulator(
		auth,
		import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST
	);
	console.log("Auth Emulator Token:", token);
}

export { auth };
