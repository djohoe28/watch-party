import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCallback, useState } from "react";
import { MessageDocumentConverter } from "../models/Firestore/MessageDocument.model";
import firestoreDb from "../services/Firestore.service";

export const useSendMessage = (roomId: string) => {
	// TODO: Reference is null *only* when roomId is invalid; Leverage this to reuse hooks!
	// Properties
	const ref = collection(
		firestoreDb,
		import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID,
		roomId,
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
			if (!roomId) {
				// TODO: Check if Room ID is URL safe?
				setError("No Room ID provided");
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
		[roomId, ref]
	);
	return { sendMessage, sending, loading, error };
};
