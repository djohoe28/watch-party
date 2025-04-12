import { RoomDocumentReference } from "@models/DB/RoomDocument.model";
import { ErrorType } from "@mytypes/AsyncContext";
import { messageConverter } from "@services/Converters/Message.converter";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";

export function useSendMessage(roomRef: RoomDocumentReference | undefined) {
	// States
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ErrorType>(undefined);
	const [sending, setSending] = useState<boolean>(false);
	// Memos (Derived Props)
	const ref = useMemo(
		() =>
			roomRef
				? collection(
						roomRef,
						import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID
				  ).withConverter(messageConverter)
				: null,
		[roomRef] // NOTE: No need to include `MessageDocumentConverter` / Env Vars in deps here.
	);
	// Callbacks
	const sendMessage = useCallback(
		(message: string, senderId: string) => {
			// TODO: Add senderName?
			if (!roomRef) {
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
				sentAt: serverTimestamp(), // TODO: Refactor as new Date()?
				content: message,
				senderId: senderId,
			})
				.then(() => {
					setSending(false);
					setError(null);
				})
				.catch((err: unknown) => {
					setSending(false);
					setError(err);
				});
		},
		[roomRef, ref]
	);

	return { sendMessage, sending, loading, error };
}
