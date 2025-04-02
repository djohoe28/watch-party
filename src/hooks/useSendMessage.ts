import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCallback, useState } from "react";
import { MessageDocumentConverter } from "../models/Firestore/MessageDocument.model";
import { RoomContextType } from "../contexts/RoomContext";
import { ErrorType } from "../types/AsyncContext";

export const useSendMessage = (roomContext: RoomContextType | null) => {
	// TODO: Reference is null *only* when roomId is invalid; Leverage this to reuse hooks!
	// States
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ErrorType>(null);
	const [sending, setSending] = useState<boolean>(false);
	// Properties
	const ref = roomContext?.payload
		? collection(
				roomContext.payload,
				import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID
		  ).withConverter(MessageDocumentConverter)
		: null; // TODO: Check if MessageCollectionConverter is needed.
	// Callbacks
	const sendMessage = useCallback(
		(message: string, senderId: string) => {
			// TODO: Add senderName?
			if (!roomContext) {
				// TODO: Check if Room ID is URL safe?
				setError("No Room Document provided");
				setLoading(false);
				return;
			}
			if (!ref) {
				setError("Failed to get Messages sub-collection reference");
				setLoading(false);
				return;
			}
			setSending(true);
			addDoc(ref, {
				sentAt: serverTimestamp(),
				content: message,
				senderId: senderId,
			})
				.then(() => {
					setSending(false);
					setError(null);
				})
				.catch((err) => {
					setSending(false);
					setError(err);
				});
		},
		[roomContext, ref]
	);
	return { sendMessage, sending, loading, error };
};
