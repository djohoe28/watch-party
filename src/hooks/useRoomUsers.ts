import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import firestoreDb from "../services/Firestore.service";
import { useState, useEffect } from "react";
import RoomDocument from "../models/Firestore/RoomDocument.model";
import { useRoomDocument } from "./useRoomDocument";
import UsersSubcollection from "../models/Firestore/UsersSubcollection.model";
import UserDocument from "../models/Firestore/UserDocument.model";

export const useRoomUsers = (roomId: string) => {
	const {
		roomDocumentRef,
		roomData: roomDocumentData,
		loading: roomDocumentLoading,
		error: roomDocumentError,
	} = useRoomDocument(roomId);
	const UsersCollectionRef = collection(
		roomDocumentRef,
		import.meta.env.VITE_FIREBASE_Users_SUBCOLLECTION_ID
	); // TODO: Type this?
	const UsersQuery = query(UsersCollectionRef, orderBy("sentAt", "asc"));
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | Error | null>(null);
	const [UsersData, setUsersData] = useState<
		(UserDocument & { id: string })[] | null
	>(null);

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
			const unsubscribe = onSnapshot(UsersQuery, (snapshot) => {
				const userList = snapshot.docs.map((doc) => ({
					id: doc.id, // Document ID
					...(doc.data() as UserDocument), // Document Data
				}));
				setUsersData(userList);
				setLoading(false);
				setError(null);
			});
			return () => unsubscribe();
		} catch (err: Error | any) {
			console.error("Error setting up chat listener:", err);
			setError(`Failed to set up chat listener: ${err.message}`);
			setLoading(false);
		}
	}, [roomId]);

	return { UsersCollectionRef, UsersData, loading, error };
};
