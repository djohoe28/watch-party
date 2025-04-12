import { Timestamp } from "firebase/firestore";
import { MediaState } from "@models/App/MediaState.model";

export interface RoomModel {
	id?: string;

	createdAt: Timestamp | null;
	// lastUpdated: Timestamp; // TODO: Type Safety?
	title?: string;
	media?: MediaState;
}
