import { setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import MediaStateMap from "../models/Firestore/MediaStateMap.model";
import { ErrorType } from "../types/AsyncContext";
import { RoomContextType } from "./useRoomDocumentData";

export const useSendRoomMediaState = (
	// TODO: Refactor to RoomDocumentReference? Needs data!
	roomContext: RoomContextType | null | undefined
) => {
	// States
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ErrorType>(null);
	const [sending, setSending] = useState<boolean>(false);
	// Properties
	const ref = roomContext ? roomContext.payload : null;
	// Callbacks
	const sendRoomMediaState = useCallback(
		(settings: Partial<MediaStateMap>) => {
			if (!roomContext) {
				setError("No Room Document context provided");
				setLoading(false);
				return;
			}
			if (!ref) {
				setError("Failed to get Room Document reference");
				setLoading(false);
				return;
			}
			setSending(true);
			// Data Validation
			// TODO: Enforce settings to include *only* MediaStateMap properties?
			// TODO: Prevent if settings is same as server?
			// Send
			const newValue = {
				...roomContext.data?.media,
				...settings,
				lastUpdated: new Date(), // TODO: serverTimestamp received twice (nanoseconds)!
			};
			console.log("Sending", newValue);
			setDoc(
				ref,
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
		[roomContext, ref]
	);
	return { sendRoomMediaState, sending, loading, error };
};
