import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";
import MediaStateMap from "./MediaStateMap.model";
import GenericFirestoreConverter from "../../utils/GenericFirestoreConverter";
import Room from "../Room.model";
import MessagesCollection from "./MessagesCollection.model";
import MembersCollection from "./MembersCollection.model";

export interface RoomDocument extends DocumentData {
	// Subcollections
	messages?: MessagesCollection | null;
	members?: MembersCollection | null;
	// Fields
	createdAt: Timestamp;
	title: string;
	media: MediaStateMap;
}

export const RoomDocumentConverter = new GenericFirestoreConverter<
	RoomDocument, // TODO: Change this to RoomModel.
	RoomDocument
>();

export type RoomDocumentReference = DocumentReference<RoomDocument, RoomDocument>;