import { Timestamp } from "firebase/firestore";

export interface MediaState {
	src: string;
	isPaused: boolean;
	currentTime: number;
	duration: number;
	description: string;
	isFile: boolean;
	lastUpdated: Timestamp | null; // TODO: Snapshot Options type safety.
}
