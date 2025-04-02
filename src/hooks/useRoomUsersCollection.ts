import { collection, DocumentReference, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { UserDocumentConverter } from "../models/Firestore/UserDocument.model";
import UserModel from "../models/User.model";
import { DEFAULT_SNAPSHOT_OPTIONS } from "../utils/GenericFirestoreConverter";
import { UsersContextType } from "../contexts/UsersContext";
import { ErrorType } from "../types/AsyncContext";
import { RoomDocumentReference } from "../models/Firestore/RoomDocument.model";

export const useRoomUsersCollection = (
	roomRef: RoomDocumentReference | null | undefined
): UsersContextType => {
	// States
	// TODO: Use RoomContext to get the roomRef? Account for loading/error/null!
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ErrorType>(null);
	const [data, setData] = useState<UserModel[] | null>(null);
	// Properties
	const ref = roomRef
		? collection(
				roomRef,
				import.meta.env.VITE_FIREBASE_USERS_SUBCOLLECTION_ID
		  ).withConverter(UserDocumentConverter)
		: null;
	// Effects
	useEffect(() => {
		if (!roomRef) {
			// TODO: Check if Room ID is URL safe?
			setError("No Room ID provided");
			setLoading(false);
			return;
		}
		if (!ref) {
			setError("Failed to get Room Users collection reference");
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			// Set up the real-time listener
			const unsubscribe = onSnapshot(ref, (snapshot) => {
				const userList = snapshot.docs.map((doc) =>
					doc.data(DEFAULT_SNAPSHOT_OPTIONS)
				);
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
