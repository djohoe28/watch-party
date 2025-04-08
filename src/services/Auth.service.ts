import { getAuth, connectAuthEmulator } from "firebase/auth";
import { firebaseApp } from "./Firebase.service";

const auth = getAuth(firebaseApp);
if (import.meta.env.DEV) {
	const token = connectAuthEmulator(
		auth,
		import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST
	);
	console.log("Auth Emulator Token:", token);
}

export { auth };
