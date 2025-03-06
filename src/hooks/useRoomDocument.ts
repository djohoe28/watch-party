import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import firestoreDb from "../services/Firestore.service";
import { useState, useEffect } from "react";

export const useRoomDocument = (roomId: string) => {
	// Get reference to the document in default ("rooms") collection
	const roomsCollection = collection(
		firestoreDb,
		import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | Error | null>(null);

	useEffect(() => {
		if (!roomId) {
			// TODO: Check if Room ID is URL safe?
			setError("No Room ID provided");
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const roomDocumentRef = doc(roomsCollection, roomId);
			// Set up the real-time listener
			const unsubscribe = onSnapshot(roomDocumentRef, (doc) => {
				if (doc.exists()) {
					console.log("Document data:", doc.data());
				}
				setLoading(false);
				setError(null);
			});
			return () => unsubscribe();
			// const roomMessagesSubcollectionRef = collection(roomDocumentRef, "messages");
			// const roomUsersSubcollectionRef = collection(roomDocumentRef, "users");
			// // Create a query that orders messages by timestamp
			// const messagesQuery = query(roomMessagesSubcollectionRef, orderBy("sentAt", "asc"));
			// // Set up the real-time listener
			// const unsubscribe = onSnapshot(messagesQuery,
			//   (snapshot) => {
			// 	// Transform the snapshot into a more usable array of messages
			// 	const messageList = snapshot.docs.map(doc => ({
			// 	  id: doc.id,	// Document ID
			// 	  ...doc.data()	// Document Data
			// 	}));
			// 	setMessages(messageList);
			// 	setLoading(false);
			// 	setError(null);
			// });
		} catch (err: Error | any) {
			console.error("Error setting up chat listener:", err);
			setError(`Failed to set up chat listener: ${err.message}`);
			setLoading(false);
		}
	}, [roomId]);

	return { roomsCollection, loading, error };
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
