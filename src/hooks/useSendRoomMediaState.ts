import { MediaState } from "@models/App/MediaState.model";
import { RoomModel } from "@models/App/Room.model";
import { ErrorType } from "@mytypes/AsyncContext";
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
		(settings?: Partial<MediaState>) => {
			if (!roomData?.ref) {
				setError("No Room Document context provided");
				return;
			}
			setSending(true);
			// Data Validation
			// TODO: Enforce settings to include *only* MediaStateMap properties?
			// TODO: Prevent if settings is same as server?
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
		[roomData?.ref, roomData?.media]
	);
	return { sendRoomMediaState, sending, error };
}
