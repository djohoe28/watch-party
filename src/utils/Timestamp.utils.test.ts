import { Temporal } from "@js-temporal/polyfill";
import { Timestamp } from "firebase/firestore";
import { describe, expect, it } from "vitest";
import { toDisplayString, toTimespanString } from "./Timestamp.utils";

describe("toDisplayString", () => {
	it("formats a Temporal.Instant", () => {
		const instant = Temporal.Instant.from("2026-01-02T03:04:05Z");
		expect(toDisplayString(instant)).toBe("2026-01-02 03:04:05");
	});

	it("formats a numeric epoch", () => {
		const epoch = Date.UTC(2026, 0, 2, 3, 4, 5);
		expect(toDisplayString(epoch)).toBe("2026-01-02 03:04:05");
	});

	it("formats a Firestore Timestamp", () => {
		const timestamp = Timestamp.fromMillis(Date.UTC(2026, 0, 2, 3, 4, 5));
		expect(toDisplayString(timestamp)).toBe("2026-01-02 03:04:05");
	});
});

describe("toTimespanString", () => {
	it("returns placeholder when seconds is undefined, without hours", () => {
		expect(toTimespanString(undefined, false)).toBe("??:??");
	});

	it("returns placeholder when seconds is undefined, with hours", () => {
		expect(toTimespanString(undefined, true)).toBe("??:??:??");
	});

	it("formats seconds under an hour as mm:ss", () => {
		expect(toTimespanString(65, false)).toBe("01:05");
	});

	it("formats seconds at zero as mm:ss", () => {
		expect(toTimespanString(0, false)).toBe("00:00");
	});

	it("formats seconds over an hour as hh:mm:ss even if showHours is false", () => {
		expect(toTimespanString(3661, false)).toBe("01:01:01");
	});

	it("forces hh:mm:ss when showHours is true, even under an hour", () => {
		expect(toTimespanString(65, true)).toBe("00:01:05");
	});
});
