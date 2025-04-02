import { doc } from "firebase/firestore";
import firestoreDb from "../services/Firestore.service";
import {
	RoomDocumentConverter,
	RoomDocumentReference,
} from "../models/Firestore/RoomDocument.model";

export const useRoomDocumentReference = (roomId: string): RoomDocumentReference | null => {
	const ref = doc(
		firestoreDb,
		import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID,
		roomId
	).withConverter(RoomDocumentConverter);
	return ref;
};
