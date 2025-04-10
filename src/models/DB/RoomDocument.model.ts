import { MediaStateMap } from "@models/DB/MediaStateMap.model";
import { MembersCollection } from "@models/DB/MembersCollection.model";
import { MessagesCollection } from "@models/DB/MessagesCollection.model";
import { GenericFirestoreConverter } from "@utils/GenericFirestoreConverter";
import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";

export interface RoomDocument extends DocumentData {
	// Subcollections
	messages?: MessagesCollection | null;
	members?: MembersCollection | null;
	// Fields
	createdAt: Timestamp;
	title?: string;
	media?: MediaStateMap;
}

export const RoomDocumentConverter = new GenericFirestoreConverter<
	RoomDocument, // TODO: Change this to RoomModel.
	RoomDocument
>();

export type RoomDocumentReference = DocumentReference<
	RoomDocument,
	RoomDocument
>;
