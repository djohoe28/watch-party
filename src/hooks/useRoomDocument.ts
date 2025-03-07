import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import firestoreDb from "../services/Firestore.service";
import { useState, useEffect } from "react";
import RoomDocument from "../models/Firestore/RoomDocument.model";

export const useRoomDocument = (roomId: string) => {
	// Get reference to the room's document.
	const roomDocumentRef = doc(
		firestoreDb,
		import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID,
		roomId
	); // TODO: Type this.
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | Error | null>(null);
	const [roomData, setRoomData] = useState<RoomDocument | null>(null);

	useEffect(() => {
		if (!roomId) {
			// TODO: Check if Room ID is URL safe?
			setError("No Room ID provided");
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			// Set up the real-time listener
			const unsubscribe = onSnapshot(roomDocumentRef, (doc) => {
				if (doc.exists()) {
					console.log("Document data:", doc.data() as RoomDocument);
					setRoomData(doc.data() as RoomDocument);
				}
				setLoading(false);
				setError(null);
			});
			return () => unsubscribe();
		} catch (err: Error | any) {
			console.error("Error setting up chat listener:", err);
			setError(`Failed to set up chat listener: ${err.message}`);
			setLoading(false);
		}
	}, [roomId]);

	return { roomDocumentRef, roomData, loading, error };
};

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import {
// 	getFirestore,
// 	collection,
// 	doc,
// 	getDoc,
// 	setDoc,
// 	onSnapshot,
// 	onSnapshotsInSync,
// 	serverTimestamp,
// } from "firebase/firestore";

// function getRoomDocumentReference(roomID: string) {
// 	const rooms = collection(
// 		firestoreDb,
// 		import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID
// 	);
// 	const room = doc(rooms, roomID);
// 	return room;
// }

// function mergeRoomToDocument(roomID: string, data: any) {
// 	const room = getRoomDocumentReference(roomID);
// 	return setDoc(room, data, { merge: true });
// }

// export {
// 	firestoreDb,
// 	getRoomDocumentReference,
// 	mergeRoomToDocument,
// 	onSnapshot,
// 	serverTimestamp,
// };
// TODO: Get Room DocumentReference as a context.
