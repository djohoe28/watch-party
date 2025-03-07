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
import { useRoomDocument } from "./useRoomDocument";
import MessagesSubcollection from "../models/Firestore/MessagesSubcollection.model";
import MessageDocument from "../models/Firestore/MessageDocument.model";

export const useRoomMessages = (roomId: string) => {
	const {
		roomDocumentRef,
		roomData: roomDocumentData,
		loading: roomDocumentLoading,
		error: roomDocumentError,
	} = useRoomDocument(roomId);
	const messagesCollectionRef = collection(
		roomDocumentRef,
		import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID
	); // TODO: Type this?
	const messagesQuery = query(
		messagesCollectionRef,
		orderBy("sentAt", "asc")
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | Error | null>(null);
	const [messagesData, setMessagesData] = useState<
		(MessageDocument & { id: string })[] | null
	>(null);

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
			const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
				const messageList = snapshot.docs.map((doc) => ({
					id: doc.id, // Document ID
					...(doc.data() as MessageDocument), // Document Data
				}));
				setMessagesData(messageList);
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

	return { messagesCollectionRef, messagesData, loading, error };
};
