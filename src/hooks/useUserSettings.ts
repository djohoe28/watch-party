import { setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { RoomUserContextType } from "../contexts/RoomUserContext";
import UserModel from "../models/User.model";
import { isColor, stringToColor } from "../utils/String.utils";
import { ErrorType } from "../types/AsyncContext";

export const useUserSettings = (roomUserContext: RoomUserContextType) => {
	// TODO: Reference is null *only* when roomId is invalid; Leverage this to reuse hooks!
	// States
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ErrorType>(null);
	const [sending, setSending] = useState<boolean>(false);
	// Properties
	const ref = roomUserContext?.payload;
	// Callbacks
	const sendUserSettings = useCallback(
		(settings: Partial<Omit<UserModel, "id">>, merge: boolean = true) => {
			if (!roomUserContext) {
				// TODO: Check if Room ID is URL safe?
				setError("No (Room) User Document context provided");
				setLoading(false);
				return;
			}
			if (!ref) {
				setError("Failed to get (Room) User Document reference");
				setLoading(false);
				return;
			}
			setSending(true);
			// Data Validation
			const isInvalidColor = settings.color && !isColor(settings.color);
			const isDefaultColor = roomUserContext.data
				? settings.color === stringToColor(roomUserContext.data?.id)
				: false;
			if (!settings.name?.trim()) delete settings.name;
			if (isInvalidColor || isDefaultColor) delete settings.color;
			// TODO: Prevent if settings is same as server?
			// Send
			setDoc(ref, settings, { merge: merge })
				.then(() => {
					setSending(false);
					setError(null);
				})
				.catch((err) => {
					setSending(false);
					setError(err);
				});
		},
		[roomUserContext, ref]
	);
	return { sendUserSettings, sending, loading, error };
};
