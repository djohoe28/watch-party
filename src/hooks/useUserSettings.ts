import { setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { RoomUserContextType } from "../contexts/RoomUserContext";
import UserModel from "../models/User.model";

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
		async (settings: Partial<UserModel>) => {
			// TODO: Add senderName?
			if (!roomUserContext) {
				// TODO: Check if Room ID is URL safe?
				setError("No (Room) User Document provided");
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
				await setDoc(ref, settings, { merge: true });
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
