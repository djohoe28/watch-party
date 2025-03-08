import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRoomDocument } from "./useRoomDocument";
import { UserDocumentConverter } from "../models/Firestore/UserDocument.model";
import User from "../models/User.model";

export const useRoomUsers = (roomId: string) => {
	const {
		roomRef: roomDocumentRef,
		roomData: _,
		loading: roomLoading,
		error: roomError,
	} = useRoomDocument(roomId);
	const usersCollectionRef = collection(
		roomDocumentRef,
		import.meta.env.VITE_FIREBASE_Users_SUBCOLLECTION_ID
	).withConverter(UserDocumentConverter);
	const usersQuery = query(usersCollectionRef, orderBy("sentAt", "asc"));
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | Error | null>(null);
	const [users, setUsers] = useState<User[] | null>(null); // TODO: UserDocument[]?

	useEffect(() => {
		if (!roomId) {
			// TODO: Check if Room ID is URL safe?
			setError("No Room ID provided");
			setLoading(false);
			return;
		}
		if (roomLoading) {
			setLoading(true);
			return;
		}
		if (roomError) {
			setError(roomError);
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			// Set up the real-time listener
			const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
				const userList = snapshot.docs.map((doc) => ({
					...doc.data(), // Document Data
					id: doc.id, // Document ID // TODO: Override ID in UserDocument model?
				}));
				setUsers(userList);
				setLoading(false);
				setError(null);
			});
			return () => unsubscribe();
		} catch (err: Error | any) {
			setError(`Failed to set up chat listener: ${err.message}`);
			setLoading(false);
		}
	}, [roomId]);

	return { users, loading, error };
};
