// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
	getFirestore,
	collection,
	doc,
	getDoc,
	setDoc,
	onSnapshot,
	onSnapshotsInSync,
	serverTimestamp,
	terminate,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// TODO: Provide context for external React use.

function getDocumentReference(roomID: string) {
	const db = getFirestore(app);
	const rooms = collection(
		db,
		import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID
	);
	const room = doc(rooms, roomID);
	return room;
}

function mergeToDocument(roomID: string, data: any) {
	const room = getDocumentReference(roomID);
	return setDoc(room, data, { merge: true });
}
