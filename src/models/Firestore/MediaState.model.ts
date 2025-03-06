import Timestamp from "./Timestamp.model";

export default interface MediaState {
	currentTime: number;
	description: string;
	duration: number;
	isFile: boolean;
	isPaused: boolean;
	lastUpdated: Timestamp;
	src: string;
}
