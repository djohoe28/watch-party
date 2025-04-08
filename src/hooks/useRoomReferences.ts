import { MemberDocumentReference, MemberDocumentConverter } from "@models/DB/MemberDocument.model";
import { MembersCollectionReference } from "@models/DB/MembersCollection.model";
import { MessageDocumentConverter } from "@models/DB/MessageDocument.model";
import { MessagesCollectionReference } from "@models/DB/MessagesCollection.model";
import { RoomDocumentReference, RoomDocumentConverter } from "@models/DB/RoomDocument.model";
import { firestoreDb } from "@services/Firestore.service";
import { doc, collection } from "firebase/firestore";

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
