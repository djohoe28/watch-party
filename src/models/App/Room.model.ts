import { MediaState } from "@models/App/MediaState.model";
import { RoomDocumentReference } from "@models/DB/RoomDocument.model";
import { Timestamp } from "firebase/firestore";

export interface RoomModel {
	id?: string;
	ref?: RoomDocumentReference;

	createdAt: Timestamp | null; // TODO: Snapshot Options type safety.
	// lastUpdated: Timestamp; // TODO: Type Safety?
	title?: string;
	media?: MediaState;
}
