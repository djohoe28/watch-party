import { Temporal } from "@js-temporal/polyfill";
import { Timestamp } from "firebase/firestore";

export interface SyncableMediaState {
	isPaused: boolean;
	currentTime: number;
	lastUpdated: Timestamp | null;
}

/**
 * Computes the video position a client should seek to when it receives a new
 * `MediaState` from Firestore, correcting for time elapsed in transit (`delta`)
 * while the room's media was playing.
 */
export function computeSyncTargetTime(
	media: SyncableMediaState,
	localCurrentTime: number | undefined,
	maxDelta: number,
	now: Temporal.Instant = Temporal.Now.instant()
): number {
	const deltaSeconds = media.lastUpdated
		? now.since(Temporal.Instant.fromEpochMilliseconds(media.lastUpdated.toMillis())).total("seconds")
		: 0;
	const isDelayed = !media.isPaused && media.currentTime - (localCurrentTime ?? 0) + deltaSeconds > maxDelta;
	return media.currentTime + (isDelayed ? deltaSeconds : 0);
}
