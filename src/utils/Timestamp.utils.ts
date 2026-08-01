import { Temporal } from "@js-temporal/polyfill";
import { Timestamp } from "firebase/firestore";

export function toDisplayString(timestamp: number | Temporal.Instant | Timestamp): string {
	const instant =
		timestamp instanceof Temporal.Instant
			? timestamp
			: Temporal.Instant.fromEpochMilliseconds(
					typeof timestamp === "number" ? timestamp : timestamp.toMillis()
				);
	return instant.toString({ smallestUnit: "second" }).replace("T", " ").replace("Z", "");
}

export function toTimespanString(
	seconds: number | undefined,
	showHours = false
): string {
	if (seconds === undefined) {
		// LINT: `!seconds` catches `seconds=0`...
		return showHours ? "??:??:??" : "??:??";
	}
	const duration = Temporal.Duration.from({ seconds: Math.trunc(seconds) }).round({ largestUnit: "hours" });
	const pad = (value: number) => value.toString().padStart(2, "0");
	return showHours || duration.hours > 0
		? `${pad(duration.hours)}:${pad(duration.minutes)}:${pad(duration.seconds)}`
		: `${pad(duration.minutes)}:${pad(duration.seconds)}`;
}
