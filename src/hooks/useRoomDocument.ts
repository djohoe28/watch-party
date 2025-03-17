import { doc, onSnapshot } from "firebase/firestore";
import firestoreDb from "../services/Firestore.service";
import { useState, useEffect } from "react";
import RoomDocument, {
	RoomDocumentConverter,
} from "../models/Firestore/RoomDocument.model";
import { FirestoreDocumentContextType } from "../types/FirestoreContextType";

export const useRoomDocument = (
	roomId: string
): FirestoreDocumentContextType<RoomDocument, RoomDocument> => {
	// TODO: What if roomId doesn't exist yet?
	const ref = doc(
		firestoreDb,
		import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID,
		roomId
	).withConverter(RoomDocumentConverter); // TODO: Type this.
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | Error | null>(null);
	const [data, setRoomData] = useState<RoomDocument | null>(null); // TODO: Use AppModel
	// TODO: setDoc(reference, data, { merge: true })
	// TODO: serverTimestamp() for lastUpdated?
	useEffect(() => {
		if (!roomId) {
			// TODO: Check if Room ID is URL safe?
			// TODO: Redirect with default Room ID query param?
			setError("No Room ID provided");
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const unsubscribe = onSnapshot(ref, (doc) => {
				if (doc.exists()) {
					setRoomData(doc.data());
				}
				setLoading(false);
				setError(null);
			});
			return () => unsubscribe();
		} catch (err: Error | any) {
			setError(
				`Error setting up ${
					import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID
				}[${roomId}] listener: ${err.message}`
			);
			setLoading(false);
		}
	}, [roomId]);

	return { ref, data, loading, error }; // TODO: Return roomRef?
};
