import { collection, DocumentReference, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import UserDocument, {
	UserDocumentConverter,
} from "../models/Firestore/UserDocument.model";
import User from "../models/User.model";
import { FirestoreCollectionContextType } from "../types/FirestoreContextType";
import { DEFAULT_SNAPSHOT_OPTIONS } from "../utils/GenericFirestoreConverter";

export const useRoomUsersCollection = (
	roomRef: DocumentReference
): FirestoreCollectionContextType<UserDocument, UserDocument> => {
	// TODO: Use RoomContext to get the roomRef? Account for loading/error/null!
	const ref = collection(
		roomRef,
		import.meta.env.VITE_FIREBASE_USERS_SUBCOLLECTION_ID
	).withConverter(UserDocumentConverter);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | Error | null>(null);
	const [data, setData] = useState<User[] | null>(null);

	useEffect(() => {
		if (!roomRef) {
			// TODO: Check if Room ID is URL safe?
			setError("No Room ID provided");
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			// Set up the real-time listener
			const unsubscribe = onSnapshot(ref, (snapshot) => {
				const userList = snapshot.docs.map((doc) => doc.data(DEFAULT_SNAPSHOT_OPTIONS));
				setData(userList);
				setLoading(false);
				setError(null);
			});
			return () => unsubscribe();
		} catch (err: Error | any) {
			setError(
				`Error setting up ${
					import.meta.env.VITE_FIREBASE_USERS_SUBCOLLECTION_ID
				} listener: ${err.message}`
			);
			setLoading(false);
		}
	}, [roomRef]);

	return { payload: ref, data, loading, error };
};
