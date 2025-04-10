import { Source } from "@models/App/Source.model";

export interface MediaState {
	source: Source;
	isPaused: boolean;
	currentTime: number;
}
