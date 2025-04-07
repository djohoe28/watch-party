import { collection, doc } from "firebase/firestore";
import firestoreDb from "../services/Firestore.service";
import {
	RoomDocumentConverter,
	RoomDocumentReference,
} from "../models/Firestore/RoomDocument.model";
import { MessageDocumentConverter } from "../models/Firestore/MessageDocument.model";
import {
	UserDocumentConverter,
	UserDocumentReference,
} from "../models/Firestore/UserDocument.model";
import { MessagesCollectionReference } from "../models/Firestore/MessagesCollection.model";
import { UsersCollectionReference } from "../models/Firestore/UsersCollection.model";

export type RoomReferences = {
	room: RoomDocumentReference;
	messages: MessagesCollectionReference;
	users: UsersCollectionReference;
	user?: UserDocumentReference | null;
};

export const useRoomReferences = (
	roomId: string,
	userId?: string
): RoomReferences | null => {
	// TODO: Use Memos?
	const roomDocumentRef = doc(
		firestoreDb,
		import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID,
		roomId
	).withConverter(RoomDocumentConverter);
	const messagesCollectionRef = collection(
		roomDocumentRef,
		import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID
	).withConverter(MessageDocumentConverter);
	const usersCollectionRef = collection(
		roomDocumentRef,
		import.meta.env.VITE_FIREBASE_USERS_SUBCOLLECTION_ID
	).withConverter(UserDocumentConverter);
	const userDocumentRef = userId
		? doc(usersCollectionRef, userId).withConverter(UserDocumentConverter)
		: null;
	return {
		room: roomDocumentRef,
		messages: messagesCollectionRef,
		users: usersCollectionRef,
		user: userDocumentRef,
	};
};
