import { Timestamp } from "firebase/firestore";

export interface MediaState {
	src: string;
	isFile: boolean;
	isPaused: boolean;
	currentTime: number;
	duration?: number;
	description?: string;
	lastUpdated: Timestamp | null; // TODO: Snapshot Options type safety.
}
