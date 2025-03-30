import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import MessageDocument, {
	MessageDocumentConverter,
} from "../models/Firestore/MessageDocument.model";
import { ErrorType } from "../types/AsyncContext";
import { DEFAULT_SNAPSHOT_OPTIONS } from "../utils/GenericFirestoreConverter";
import { MessagesContextType } from "../contexts/MessagesContext";
import { RoomContextType } from "../contexts/RoomContext";

export const useRoomMessagesQuery = (
	roomContext: RoomContextType | null
): MessagesContextType => {
	// States
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ErrorType>(null);
	const [data, setData] = useState<MessageDocument[] | null>(null);
	// TODO: Use RoomContext to get the roomRef? Account for loading/error/null!
	// Properties
	const collectionRef = roomContext?.payload
		? collection(
				roomContext.payload,
				import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID
		  ).withConverter(MessageDocumentConverter)
		: null;
	const queryRef = collectionRef
		? query(collectionRef, orderBy("sentAt", "asc"))
		: null;
	// Effects
	useEffect(() => {
		if (!roomContext) {
			// TODO: Check if Room ID is URL safe?
			setError("No Room ID provided");
			setLoading(false);
			return;
		}
		if (!collectionRef) {
			setError("No Room Messages collection provided");
			setLoading(false);
			return;
		}
		if (!queryRef) {
			setError("No Room Messages collection query provided");
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const unsubscribe = onSnapshot(queryRef, (snapshot) => {
				// TODO: Add id to AppModelType?
				const messageList = snapshot.docs.map((doc) =>
					doc.data(DEFAULT_SNAPSHOT_OPTIONS)
				);
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
	}, [roomContext]);

	return { payload: queryRef, data, loading, error };
};
