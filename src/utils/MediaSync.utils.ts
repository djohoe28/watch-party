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
	now: number = Date.now()
): number {
	const deltaSeconds = media.lastUpdated ? (now - media.lastUpdated.toDate().getTime()) / 1000 : 0;
	const isDelayed = !media.isPaused && media.currentTime - (localCurrentTime ?? 0) + deltaSeconds > maxDelta;
	return media.currentTime + (isDelayed ? deltaSeconds : 0);
}
