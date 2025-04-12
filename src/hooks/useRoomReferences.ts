import { MemberDocumentReference } from "@models/DB/MemberDocument.model";
import { MembersCollectionReference } from "@models/DB/MembersCollection.model";
import { MessagesCollectionReference } from "@models/DB/MessagesCollection.model";
import { RoomDocumentReference } from "@models/DB/RoomDocument.model";
import { memberConverter } from "@services/Converters/Member.converter";
import { messageConverter } from "@services/Converters/Message.converter";
import { roomConverter } from "@services/Converters/Room.converter";
import { firestoreDb } from "@services/Firestore.service";
import { collection, doc } from "firebase/firestore";

export interface RoomReferences {
	room: RoomDocumentReference;
	messages: MessagesCollectionReference;
	members: MembersCollectionReference;
	member?: MemberDocumentReference | null;
}

export function useRoomReferences(
	roomId: string,
	memberId?: string
): RoomReferences | null {
	// TODO: Use Memos?
	const roomDocumentRef = doc(
		firestoreDb,
		import.meta.env.VITE_FIREBASE_ROOMS_COLLECTION_ID,
		roomId
	).withConverter(roomConverter);
	const messagesCollectionRef = collection(
		roomDocumentRef,
		import.meta.env.VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID
	).withConverter(messageConverter);
	const membersCollectionRef = collection(
		roomDocumentRef,
		import.meta.env.VITE_FIREBASE_MEMBERS_SUBCOLLECTION_ID
	).withConverter(memberConverter);
	const memberDocumentRef = memberId
		? doc(membersCollectionRef, memberId).withConverter(memberConverter)
		: null;
	return {
		room: roomDocumentRef,
		messages: messagesCollectionRef,
		members: membersCollectionRef,
		member: memberDocumentRef,
	};
}
