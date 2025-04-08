import { Timestamp } from "firebase/firestore";

export interface MediaStateMap {
	currentTime: number;
	description: string;
	duration: number;
	isFile: boolean;
	isPaused: boolean;
	lastUpdated: Timestamp;
	src: string;
}
