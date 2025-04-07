import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";
import MediaStateMap from "./MediaStateMap.model";
import GenericFirestoreConverter from "../../utils/GenericFirestoreConverter";
import Room from "../Room.model";
import MessagesCollection from "./MessagesCollection.model";
import UsersCollection from "./UsersCollection.model";

export default interface RoomDocument extends DocumentData {
	// Subcollections
	messages?: MessagesCollection | null;
	users?: UsersCollection | null;
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