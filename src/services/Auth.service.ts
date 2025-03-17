import { getAuth, connectAuthEmulator } from "firebase/auth";

const auth = getAuth();
if (process.env.NODE_ENV === "development") {
	const token = connectAuthEmulator(
		auth,
		import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST
	);
	console.log("Auth Emulator Token:", token);
}

export default auth;
