import { MediaState } from "@models/App/MediaState.model";
import { Timestamp } from "firebase/firestore";

export interface RoomModel {
	id?: string;

	createdAt: Timestamp | null; // TODO: Snapshot Options type safety.
	// lastUpdated: Timestamp; // TODO: Type Safety?
	title?: string;
	media?: MediaState;
}
