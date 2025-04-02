import { serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { RoomContextType } from "../contexts/RoomContext";
import MediaStateMap from "../models/Firestore/MediaStateMap.model";
import { ErrorType } from "../types/AsyncContext";

export const useSendRoomMediaState = (roomContext: RoomContextType | null) => {
	// TODO: Reference is null *only* when roomId is invalid; Leverage this to reuse hooks!
	// States
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ErrorType>(null);
	const [sending, setSending] = useState<boolean>(false);
	// Properties
	const ref = roomContext?.payload;
	// Callbacks
	const sendRoomMediaState = useCallback(
		(settings: Partial<MediaStateMap>) => {
			if (!roomContext) {
				// TODO: Check if Room ID is URL safe?
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
				lastUpdated: serverTimestamp(),
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
