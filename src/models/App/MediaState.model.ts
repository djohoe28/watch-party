import { Timestamp } from "firebase/firestore";

export interface MediaState {
	currentTime: number;
	description: string;
	duration: number;
	isFile: boolean;
	isPaused: boolean;
	lastUpdated: Timestamp | null; // TODO: Snapshot Options type safety.
	src: string;
}
