import { collection, doc } from "firebase/firestore";
import firestoreDb from "../services/Firestore.service";
import {
	RoomDocumentConverter,
	RoomDocumentReference,
} from "../models/Firestore/RoomDocument.model";
import { MessageDocumentConverter } from "../models/Firestore/MessageDocument.model";
import {
	MemberDocumentConverter,
	MemberDocumentReference,
} from "../models/Firestore/MemberDocument.model";
import { MessagesCollectionReference } from "../models/Firestore/MessagesCollection.model";
import { MembersCollectionReference } from "../models/Firestore/MembersCollection.model";

export type RoomReferences = {
	room: RoomDocumentReference;
	messages: MessagesCollectionReference;
	members: MembersCollectionReference;
	member?: MemberDocumentReference | null;
};

export function useRoomReferences(
	roomId: string,
	memberId?: string
): RoomReferences | null {
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
	const membersCollectionRef = collection(
		roomDocumentRef,
		import.meta.env.VITE_FIREBASE_MEMBERS_SUBCOLLECTION_ID
	).withConverter(MemberDocumentConverter);
	const memberDocumentRef = memberId
		? doc(membersCollectionRef, memberId).withConverter(
				MemberDocumentConverter
		  )
		: null;
	return {
		room: roomDocumentRef,
		messages: messagesCollectionRef,
		members: membersCollectionRef,
		member: memberDocumentRef,
	};
}
