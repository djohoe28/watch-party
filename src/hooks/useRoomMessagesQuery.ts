import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import MessageDocument, {
	MessageDocumentConverter,
} from "../models/Firestore/MessageDocument.model";
import { FirestoreQueryContextType } from "../types/FirestoreContextType";
import firestoreDb from "../services/Firestore.service";

export const useRoomMessagesQuery = (
	roomId: string
): FirestoreQueryContextType<MessageDocument, MessageDocument> => {
	// TODO: Use RoomContext to get the roomRef? Account for loading/error/null!
	const collectionRef = collection(
		firestoreDb,
		import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID,
		roomId,
		import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID
	).withConverter(MessageDocumentConverter);
	const queryRef = query(collectionRef, orderBy("sentAt", "asc"));
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | Error | null>(null);
	const [data, setData] = useState<MessageDocument[] | null>(null);

	useEffect(() => {
		if (!roomId) {
			// TODO: Check if Room ID is URL safe?
			setError("No Room ID provided");
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const unsubscribe = onSnapshot(queryRef, (snapshot) => {
				// TODO: Add id to AppModelType?
				const messageList = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id }; // TODO: id only used as key for future mapping.
				});
				setData(messageList);
				setLoading(false);
				setError(null);
			});
			return () => unsubscribe();
		} catch (err: Error | any) {
			setError(
				`Error setting up ${
					import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID
				} listener: ${err.message}`
			);
			setLoading(false);
		}
	}, [roomId]);

	return { ref: queryRef, data, loading, error };
};
