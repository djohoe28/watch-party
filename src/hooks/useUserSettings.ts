import { setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import UserModel from "../models/User.model";
import { isColor, stringToColor } from "../utils/String.utils";
import { ErrorType } from "../types/AsyncContext";
import { UserDocumentReference } from "../models/Firestore/UserDocument.model";
import { useDocumentData } from "react-firebase-hooks/firestore";

export const useUserSettings = (
	ref: UserDocumentReference | null | undefined
	// TODO: Add AsyncContext<User> ? Assumes `ref` is correct, but doesn't exist.
) => {
	// LINT: Is documentData necessary..?
	// Hooks
	const [documentData, documentLoading, documentError, documentSnapshot] =
		useDocumentData(ref);
	// States
	const [loading, setLoading] = useState<boolean>(documentLoading || true);
	const [error, setError] = useState<ErrorType>(documentError || null);
	const [sending, setSending] = useState<boolean>(false);
	// Effects
	useEffect(() => {
		console.log(documentData);
		// NOTE: Creates User Document if it doesn't exist.
		if (ref && documentSnapshot?.exists() === false) {
			setDoc(ref, { id: ref.id } as UserModel);
			// TODO: Use .then() / .catch() ?
			// TODO: Make sure this doesn't cause a race condition, including Strict Mode!
		}
	}, [documentSnapshot]);
	// Callbacks
	const sendUserSettings = useCallback(
		(settings: Partial<Omit<UserModel, "id">>, merge: boolean = true) => {
			if (!ref) {
				setError("Failed to get (Room) User Document reference");
				setLoading(false);
				return;
			}
			setSending(true);
			// Data Validation
			const isInvalidColor = settings.color && !isColor(settings.color);
			const isDefaultColor = documentData
				? settings.color === stringToColor(documentData.id)
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
		[documentData, ref]
	);
	return { sendUserSettings, sending, loading, error };
};
