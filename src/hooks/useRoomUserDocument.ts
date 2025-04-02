import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import UserDocument, {
	UserDocumentConverter,
} from "../models/Firestore/UserDocument.model";
import UserModel from "../models/User.model";
import { DEFAULT_SNAPSHOT_OPTIONS } from "../utils/GenericFirestoreConverter";
import { User } from "firebase/auth";
import { AsyncContext, ErrorType } from "../types/AsyncContext";
import { UsersCollectionReference } from "../models/Firestore/UsersCollection.model";
import { FirestoreDocumentContextType } from "../types/FirestoreContextType";

export type RoomUserContextType = FirestoreDocumentContextType<
	UserModel,
	UserDocument
>;

function createUserDocument(auth: User): UserModel {
	// TODO: Duplicate `id` field in UserDocument.
	return { id: auth.uid } as UserModel;
}

export const useRoomUserDocument = (
	usersRef: UsersCollectionReference | null | undefined,
	auth: AsyncContext<User> // TODO: Replace with User?
): RoomUserContextType => {
	// States
	// TODO: Use RoomContext to get the roomRef? Account for loading/error/null!
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ErrorType>(null);
	const [data, setData] = useState<UserModel | null | undefined>(null); // TODO: Why is undefined required here?
	// Properties
	const ref =
		auth.payload?.uid && usersRef
			? doc(usersRef, auth.payload?.uid).withConverter(
					UserDocumentConverter
			  )
			: null;
	// Effects
	useEffect(() => {
		if (!auth) {
			setError("No User auth provided");
			setLoading(false);
			return;
		}
		if (!usersRef) {
			setError("No Users collection provided");
			setLoading(false);
			return;
		}
		if (!ref) {
			setError("No User Document reference provided");
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			// Set up the real-time listener
			const unsubscribe = onSnapshot(ref, (snapshot) => {
				if (!snapshot.exists() && auth.payload) {
					const userDocument = createUserDocument(auth.payload);
					setDoc(ref, userDocument);
					setData(userDocument); // TODO: Redundant? Snapshot will re-trigger.
					setLoading(false);
					setError(null);
					return;
				}
				const userDoc = snapshot.data(DEFAULT_SNAPSHOT_OPTIONS);
				setData(userDoc);
				setLoading(false);
				setError(null);
			});
			return () => unsubscribe();
		} catch (err: Error | any) {
			setError(
				`Error setting up ${
					import.meta.env.VITE_FIREBASE_USERS_SUBCOLLECTION_ID
				} ${auth.payload?.uid} listener: ${err.message}`
			);
			setLoading(false);
		}
	}, [usersRef, auth]);

	return { payload: ref, data, setData, loading, error };
};
