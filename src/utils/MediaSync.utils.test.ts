import { Temporal } from "@js-temporal/polyfill";
import { Timestamp } from "firebase/firestore";
import { describe, expect, it } from "vitest";
import { computeSyncTargetTime } from "./MediaSync.utils";

describe("computeSyncTargetTime", () => {
	it("returns the server currentTime unchanged when paused", () => {
		const media = { isPaused: true, currentTime: 42, lastUpdated: Timestamp.fromMillis(0) };
		// 10s have passed since lastUpdated, but paused media shouldn't drift-correct.
		expect(computeSyncTargetTime(media, 0, 1, Temporal.Instant.fromEpochMilliseconds(10_000))).toBe(42);
	});

	it("returns the server currentTime unchanged when lastUpdated is null", () => {
		const media = { isPaused: false, currentTime: 42, lastUpdated: null };
		// No `lastUpdated` means there's nothing to correct for, regardless of local drift.
		expect(computeSyncTargetTime(media, 0, 1, Temporal.Instant.fromEpochMilliseconds(10_000))).toBe(42);
	});

	it("does not correct for drift within maxDelta tolerance", () => {
		const media = { isPaused: false, currentTime: 10, lastUpdated: Timestamp.fromMillis(0) };
		// 500ms transit + 0.4s local lag = 0.9s total drift, within a 1s tolerance.
		expect(computeSyncTargetTime(media, 9.6, 1, Temporal.Instant.fromEpochMilliseconds(500))).toBe(10);
	});

	it("adds elapsed transit time when playing and drift exceeds maxDelta", () => {
		const media = { isPaused: false, currentTime: 10, lastUpdated: Timestamp.fromMillis(0) };
		// now is 3000ms after lastUpdated -> 3s of transit, well past a 1s tolerance.
		expect(computeSyncTargetTime(media, 0, 1, Temporal.Instant.fromEpochMilliseconds(3000))).toBe(13);
	});

	it("treats an undefined local currentTime as 0", () => {
		const media = { isPaused: false, currentTime: 10, lastUpdated: Timestamp.fromMillis(0) };
		expect(computeSyncTargetTime(media, undefined, 1, Temporal.Instant.fromEpochMilliseconds(3000))).toBe(13);
	});

	it("defaults `now` to Temporal.Now.instant() when not provided", () => {
		const media = { isPaused: false, currentTime: 5, lastUpdated: Timestamp.fromMillis(Temporal.Now.instant().epochMilliseconds) };
		// lastUpdated is ~now, so transit time is a few ms at most - comfortably within a 1s tolerance.
		expect(computeSyncTargetTime(media, 5, 1)).toBe(5);
	});
});
