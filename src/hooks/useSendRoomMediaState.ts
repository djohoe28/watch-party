import { MediaState } from "@models/App/MediaState.model";
import { RoomModel } from "@models/App/Room.model";
import { RoomDocumentReference } from "@models/DB/RoomDocument.model";
import { ErrorType } from "@mytypes/AsyncContext";
import { serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";

export function useSendRoomMediaState(
	roomRef: RoomDocumentReference | null | undefined,
	roomData: RoomModel | undefined // HACK: In order to not retrieve room data *twice* (in MediaPlayer), we accept it as a parameter.
) {
	// States
	const [error, setError] = useState<ErrorType>(null);
	const [sending, setSending] = useState<boolean>(false);
	// Callbacks
	const sendRoomMediaState = useCallback(
		(settings: Partial<MediaState>) => {
			if (!roomRef) {
				setError("No Room Document context provided");
				return;
			}
			setSending(true);
			// Data Validation
			// TODO: Enforce settings to include *only* MediaStateMap properties?
			// TODO: Prevent if settings is same as server?
			// Send
			const newValue = {
				...roomData?.media,
				...settings,
				lastUpdated: serverTimestamp(), // TODO: serverTimestamp received twice (nanoseconds)!
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
				.catch((err: unknown) => {
					setSending(false);
					setError(err);
				});
		},
		[roomRef]
	);
	return { sendRoomMediaState, sending, error };
}
