import { useEffect, useState } from "react";
import {
	collection,
	query,
	orderBy,
	onSnapshot,
	DocumentReference,
} from "firebase/firestore";
import MessageDocument, {
	MessageDocumentConverter,
} from "../models/Firestore/MessageDocument.model";
import { FirestoreQueryContextType } from "../types/FirestoreContextType";
import { ErrorType } from "../types/AsyncContext";
import { DEFAULT_SNAPSHOT_OPTIONS } from "../utils/GenericFirestoreConverter";

export const useRoomMessagesQuery = (
	roomRef: DocumentReference
): FirestoreQueryContextType<MessageDocument, MessageDocument> => {
	// TODO: Use RoomContext to get the roomRef? Account for loading/error/null!
	const collectionRef = collection(
		roomRef,
		import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID
	).withConverter(MessageDocumentConverter);
	const queryRef = query(collectionRef, orderBy("sentAt", "asc"));
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ErrorType>(null);
	const [data, setData] = useState<MessageDocument[] | null>(null);

	useEffect(() => {
		if (!roomRef) {
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
					return { ...doc.data(DEFAULT_SNAPSHOT_OPTIONS), id: doc.id }; // TODO: id only used as key for future mapping.
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
	}, [roomRef]);

	return { payload: queryRef, data, loading, error };
};
