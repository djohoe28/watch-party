import { onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import RoomDocument, {
	RoomDocumentReference,
} from "../models/Firestore/RoomDocument.model";
import { ErrorType } from "../types/AsyncContext";
import { DEFAULT_SNAPSHOT_OPTIONS } from "../utils/GenericFirestoreConverter";
import { FirestoreDocumentContextType } from "../types/FirestoreContextType";

export type RoomContextType = FirestoreDocumentContextType<
	RoomDocument,
	RoomDocument
>;

export const useRoomDocumentData = (
	roomRef: RoomDocumentReference | null
): RoomContextType => {
	// States
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ErrorType>(null);
	const [data, setRoomData] = useState<RoomDocument | null>(null); // TODO: Use AppModel
	// Properties
	// TODO: What if roomId doesn't exist yet?
	const ref = roomRef;
	// TODO: setDoc(reference, data, { merge: true })
	// TODO: serverTimestamp() for lastUpdated?
	// Effects
	useEffect(() => {
		if (!ref) {
			setError("No Room Document reference provided");
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const unsubscribe = onSnapshot(ref, (document) => {
				if (document.exists()) {
					setRoomData(document.data(DEFAULT_SNAPSHOT_OPTIONS));
				}
				setLoading(false);
				setError(null);
			});
			return () => unsubscribe();
		} catch (err: Error | any) {
			setError(
				`Error setting up ${
					import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID
				}[${roomRef.id}] listener: ${err.message}`
			);
			setLoading(false);
		}
	}, [roomRef?.id]);

	return { payload: ref, data, loading, error }; // TODO: Return roomRef?
};
