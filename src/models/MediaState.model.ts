import { Source } from "./Source.model";

export interface MediaState {
	source: Source;
	isPaused: boolean;
	currentTime: number;
}
