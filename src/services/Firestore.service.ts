import { firebaseApp } from "@services/Firebase.service";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firestoreDb = getFirestore(firebaseApp); // TODO: Add Database ID?
if (import.meta.env.DEV) {
	const token = null; // LINTODO
	connectFirestoreEmulator(
		firestoreDb,
		import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_HOST,
		import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT
	);
	console.log("Firestore Emulator Token:", token);
}
export { firestoreDb };
