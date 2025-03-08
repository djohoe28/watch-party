import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRoomDocument } from "./useRoomDocument";
import MessageDocument, {
	MessageDocumentConverter,
} from "../models/Firestore/MessageDocument.model";

export const useRoomMessages = (roomId: string) => {
	const {
		roomRef: roomRef,
		roomData: _,
		loading: roomLoading,
		error: roomError,
	} = useRoomDocument(roomId);
	const messagesCollectionRef = collection(
		roomRef,
		import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID
	).withConverter(MessageDocumentConverter); // TODO: Check if MessageCollectionConverter is needed.
	const messagesQuery = query(
		messagesCollectionRef,
		orderBy("sentAt", "asc")
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | Error | null>(null);
	const [messages, setMessages] = useState<MessageDocument[] | null>(null); // TODO: Use AppModel

	useEffect(() => {
		if (!roomId) {
			// TODO: Check if Room ID is URL safe?
			setError("No Room ID provided");
			setLoading(false);
			return;
		}
		if (roomLoading) {
			setLoading(true);
			return;
		}
		if (roomError) {
			setError(roomError);
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			// Set up the real-time listener
			const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
				snapshot.docChanges().map((change) => {
					console.log(
						import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID,
						change.type,
						change.doc.data()
					);
				});
				// TODO: Refactor to use docChanges() instead of re-mapping docs. (Reducer?)
				const messageList = snapshot.docs.map((doc) => doc.data());
				setMessages(messageList);
				setLoading(false);
				setError(null);
			});
			return () => unsubscribe();
		} catch (err: Error | any) {
			setError(`Failed to set up chat listener: ${err.message}`);
			setLoading(false);
		}
	}, [roomId]);

	return { messages, loading, error };
};
