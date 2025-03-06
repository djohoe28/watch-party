// Import the functions you need from the SDKs you need
import {
	getFirestore,
	collection,
	doc,
	getDoc,
	setDoc,
	onSnapshot,
	onSnapshotsInSync,
	serverTimestamp,
} from "firebase/firestore";
import firebaseApp from "./Firebase.service";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase

const firestoreDb = getFirestore(firebaseApp);

function getRoomDocumentReference(roomID: string) {
	const rooms = collection(
		firestoreDb,
		import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID
	);
	const room = doc(rooms, roomID);
	return room;
}

function mergeRoomToDocument(roomID: string, data: any) {
	const room = getRoomDocumentReference(roomID);
	return setDoc(room, data, { merge: true });
}

export {
	firestoreDb,
	getRoomDocumentReference,
	mergeRoomToDocument,
	onSnapshot,
	serverTimestamp,
};
// TODO: Get Room DocumentReference as a context.
