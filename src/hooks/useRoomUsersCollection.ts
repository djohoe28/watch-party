import { collection, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import UserDocument, {
	UserDocumentConverter,
} from "../models/Firestore/UserDocument.model";
import User from "../models/User.model";
import firestoreDb from "../services/Firestore.service";
import { FirestoreCollectionContextType } from "../types/FirestoreContextType";

export const useRoomUsersCollection = (
	roomId: string
): FirestoreCollectionContextType<UserDocument, UserDocument> => {
	// TODO: Use RoomContext to get the roomRef? Account for loading/error/null!
	const ref = collection(
		firestoreDb,
		import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID,
		roomId,
		import.meta.env.VITE_FIREBASE_USERS_SUBCOLLECTION_ID
	).withConverter(UserDocumentConverter);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | Error | null>(null);
	const [data, setData] = useState<User[] | null>(null);

	useEffect(() => {
		if (!roomId) {
			// TODO: Check if Room ID is URL safe?
			setError("No Room ID provided");
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			// Set up the real-time listener
			const unsubscribe = onSnapshot(ref, (snapshot) => {
				// TODO: Add id to AppModelType?
				const userList = snapshot.docs.map((doc) => ({
					...doc.data(), // Document Data
					id: doc.id, // Document ID // TODO: Override ID in UserDocument model?
				}));
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
	}, [roomId]);

	return { ref, data, loading, error };
};
