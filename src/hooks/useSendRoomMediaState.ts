import { MediaState } from "@models/App/MediaState.model";
import { RoomModel } from "@models/App/Room.model";
import { ErrorType } from "@mytypes/ErrorType";
import { deleteField, serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";

export function useSendRoomMediaState(
	roomData: RoomModel | undefined // HACK: In order to not retrieve room data *twice* (in MediaPlayer), we accept it as a parameter.
) {
	// States
	const [error, setError] = useState<ErrorType>(null);
	const [sending, setSending] = useState<boolean>(false);
	// Callbacks
	const sendRoomMediaState = useCallback(
		(settings?: Partial<MediaState>, merge = true) => {
			if (!roomData?.ref) {
				setError("No Room Document context provided");
				return;
			}
			const currentMedia = roomData.media;
			if (
				settings &&
				currentMedia &&
				(Object.entries(settings) as [keyof MediaState, MediaState[keyof MediaState]][]).every(
					([key, value]) => currentMedia[key] === value
				)
			) {
				console.log("You're good.");
				return;
			}
			setSending(true);
			// Data Validation
			// TODO: Enforce settings to include *only* MediaStateMap properties?
			// TODO: Handle undefined settings!
			// Send
			const newValue = settings
				? {
						...roomData.media,
						...settings,
						lastUpdated: serverTimestamp(), // TODO: serverTimestamp received twice (nanoseconds)!
				  }
				: deleteField();
			console.log("Sending", newValue);
			setDoc(
				roomData.ref,
				{
					media: newValue,
				},
				{ merge: merge }
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
		[roomData?.ref, roomData?.media]
	);
	return { sendRoomMediaState, sending, error };
}
