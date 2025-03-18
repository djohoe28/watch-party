import {
	addDoc,
	collection,
	DocumentReference,
	serverTimestamp,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import { MessageDocumentConverter } from "../models/Firestore/MessageDocument.model";

export const useSendMessage = (roomRef: DocumentReference) => {
	// TODO: Reference is null *only* when roomId is invalid; Leverage this to reuse hooks!
	// Properties
	const ref = collection(
		roomRef,
		import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID
	).withConverter(MessageDocumentConverter); // TODO: Check if MessageCollectionConverter is needed.
	// States
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | Error | null>(null);
	const [sending, setSending] = useState<boolean>(false);
	// Methods
	const sendMessage = useCallback(
		async (message: string, senderId: string) => {
			// TODO: Add senderName?
			if (!roomRef) {
				// TODO: Check if Room ID is URL safe?
				setError("No Room Document provided");
				setLoading(false);
				return;
			}
			setSending(true);
			try {
				await addDoc(ref, {
					sentAt: serverTimestamp(),
					content: message,
					senderId: senderId,
				});
				setSending(false);
				setError(null);
			} catch (err: Error | any) {
				setError(err);
				setSending(false);
			}
		},
		[roomRef, ref]
	);
	return { sendMessage, sending, loading, error };
};
