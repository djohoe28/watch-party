import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { firebaseApp } from "@services/Firebase.service";

const firestoreDb = getFirestore(firebaseApp); // TODO: Add Database ID?
if (import.meta.env.DEV) {
	const token = connectFirestoreEmulator(
		firestoreDb,
		import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_HOST,
		import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT
	);
	console.log("Firestore Emulator Token:", token);
}
export { firestoreDb };
