import { deleteField, FieldValue, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { RoomUserContextType } from "../contexts/RoomUserContext";
import UserModel from "../models/User.model";
import { isColor, stringToColor } from "../utils/String.utils";

export const useUserSettings = (roomUserContext: RoomUserContextType) => {
	// TODO: Reference is null *only* when roomId is invalid; Leverage this to reuse hooks!
	// States
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | Error | null>(null);
	const [sending, setSending] = useState<boolean>(false);
	// Properties
	const ref = roomUserContext?.payload;
	// Callbacks
	const sendUserSettings = useCallback(
		async (
			settings: Partial<Omit<UserModel, "id">>,
			merge: boolean = true
		) => {
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
			try {
				// Data Validation
				const isInvalidColor =
					settings.color && !isColor(settings.color);
				const isDefaultColor = roomUserContext.data
					? settings.color === stringToColor(roomUserContext.data?.id)
					: false;
				if (!settings.name?.trim()) delete settings.name;
				if (isInvalidColor || isDefaultColor) delete settings.color;
				// TODO: Prevent if settings is same as server?
				// Send
				await setDoc(ref, settings, { merge: merge });
				setSending(false);
				setError(null);
			} catch (err: Error | any) {
				setError(err);
				setSending(false);
			}
		},
		[roomUserContext, ref]
	);
	return { sendUserSettings, sending, loading, error };
};
