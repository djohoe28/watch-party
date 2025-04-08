import { setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import MediaStateMap from "../models/Firestore/MediaStateMap.model";
import { ErrorType } from "../types/AsyncContext";
import { RoomDocumentReference } from "../models/Firestore/RoomDocument.model";
import { useDocumentData } from "react-firebase-hooks/firestore";

export function useSendRoomMediaState(
	roomRef: RoomDocumentReference | null | undefined
) {
	// LINT: Is documentData necessary..?
	// Hooks
	const [documentData, documentLoading, documentError, _] =
		useDocumentData(roomRef);
	// States
	const [loading, setLoading] = useState<boolean>(documentLoading || true);
	const [error, setError] = useState<ErrorType>(documentError || null);
	const [sending, setSending] = useState<boolean>(false);
	// Callbacks
	const sendRoomMediaState = useCallback(
		(settings: Partial<MediaStateMap>) => {
			if (!roomRef) {
				setError("No Room Document context provided");
				setLoading(false);
				return;
			}
			setSending(true);
			// Data Validation
			// TODO: Enforce settings to include *only* MediaStateMap properties?
			// TODO: Prevent if settings is same as server?
			// Send
			const newValue = {
				...documentData?.media,
				...settings,
				lastUpdated: new Date(), // TODO: serverTimestamp received twice (nanoseconds)!
			};
			console.log("Sending", newValue);
			setDoc(
				roomRef,
				{
					media: newValue,
				},
				{ merge: true }
			)
				.then(() => {
					setSending(false);
					setError(null);
				})
				.catch((err) => {
					setSending(false);
					setError(err);
				});
		},
		[roomRef]
	);
	return { sendRoomMediaState, sending, loading, error };
};
