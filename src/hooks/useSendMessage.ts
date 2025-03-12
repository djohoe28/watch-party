import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCallback, useState } from "react";
import { MessageDocumentConverter } from "../models/Firestore/MessageDocument.model";
import { useRoomDocument } from "./useRoomDocument";

export const useSendMessage = (roomId: string) => {
	// TODO: IMPLEMENT THIS!!!!
	// TODO: Reference is null *only* when roomId is invalid; Leverage this to reuse hooks!
	// Properties
	const {
		ref: roomRef,
		data: _,
		loading: roomLoading,
		error: roomError,
	} = useRoomDocument(roomId);
	const messagesCollectionRef = collection(
		roomRef,
		import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID
	).withConverter(MessageDocumentConverter); // TODO: Check if MessageCollectionConverter is needed.
	// States
	const [sending, setSending] = useState<boolean>(false);
	const [error, setError] = useState<string | Error | null>(null);
	// Methods
	const sendMessage = useCallback(
		async (message: string, senderId: string) => {
			if (!roomId) return; // TODO: Check if Room ID is URL safe?
			if (roomLoading) {
				setSending(true);
				return;
			}
			if (roomError) {
				setError(roomError);
				setSending(false);
				return;
			}
			setSending(true);
			try {
				console.log("Sending message", message, senderId);
				await addDoc(messagesCollectionRef, {
					sentAt: serverTimestamp(),
					content: message,
					senderId: senderId,
				});
				console.log("Message sent");
				setSending(false);
				setError(null);
			} catch (e: Error | any) {
				setError(e);
				setSending(false);
			}
		},
		[roomId, roomLoading, roomError, messagesCollectionRef]
	);
	return { sending, error, sendMessage };
};
