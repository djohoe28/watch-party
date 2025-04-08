import { MemberDocumentReference } from "@models/Firestore/MemberDocument.model";
import { MemberModel } from "@models/Member.model";
import { ErrorType } from "../types/AsyncContext"; // LINT: @types ?
import { isColor, stringToColor } from "@utils/String.utils";
import { setDoc } from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";


export function useMemberSettings (
	ref: MemberDocumentReference | null | undefined
	// TODO: Add AsyncContext<User> ? Assumes `ref` is correct, but doesn't exist.
) {
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
		// NOTE: Creates User Document if it doesn't exist.
		if (ref && documentSnapshot?.exists() === false) {
			setDoc(ref, { id: ref.id } as MemberModel)
				.then(() => {
					setLoading(documentLoading || false); // TODO: Make sure this doesn't cause a race condition, including Strict Mode!
					setError((prev) => prev || null);
				})
				.catch((err) => {
					setLoading(documentLoading || false); // TODO: Make sure this doesn't cause a race condition, including Strict Mode!
					setError((prev) => prev || err); // LINT: Should an existing Error be "chained"?
				});
			// TODO: Make sure this doesn't cause a race condition, including Strict Mode!
		} else {
			setLoading(documentLoading || false); // TODO: Make sure this doesn't cause a race condition, including Strict Mode!
			setError((prev) => prev || null);
		}
	}, [documentSnapshot]);
	// Callbacks
	const sendMemberSettings = useCallback(
		(settings: Partial<Omit<MemberModel, "id">>, merge: boolean = true) => {
			if (!ref) {
				setError(
					(prev) =>
						prev || "Failed to get (Room) User Document reference"
				); // LINT: Make sure this doesn't cause a race condition, including Strict Mode!
				setLoading(false); // LINT: This is a bit misleading, but it's not a loading error.
				return;
			}
			setSending(true);
			// Data Validation
			const isInvalidColor = settings.color && !isColor(settings.color);
			const isDefaultColor = documentData
				? settings.color === stringToColor(documentData.id)
				: false;
			if (!settings.name?.trim()) delete settings.name; // TODO: Does this affect settings (if passed by reference)?
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
	return { sendMemberSettings, sending, loading, error };
};
