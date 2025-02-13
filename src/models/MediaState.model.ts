import type Source from "./Source.model";

export default interface MediaState {
	source: Source;
	isPaused: boolean;
	currentTime: number;
}
