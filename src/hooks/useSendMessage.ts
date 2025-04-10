import { MessageDocumentConverter } from "@models/DB/MessageDocument.model";
import { RoomDocumentReference } from "@models/DB/RoomDocument.model";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";
import { ErrorType } from "../types/AsyncContext"; // LINT: @types ?

export function useSendMessage(
	roomRef: RoomDocumentReference | null | undefined
) {
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
				  ).withConverter(MessageDocumentConverter)
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
				.catch((err) => {
					setSending(false);
					setError(err);
				});
		},
		[roomRef, ref]
	);

	return { sendMessage, sending, loading, error };
}
