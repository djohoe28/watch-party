import { Timestamp } from "firebase/firestore";

export function toDisplayString(timestamp: number | Date | Timestamp): string {
	let date: Date;
	if (timestamp instanceof Date) {
		date = timestamp;
	} else if (typeof timestamp === "number") {
		date = new Date(timestamp);
	} else {
		date = timestamp.toDate();
	}
	return date.toISOString().replace("T", " ").substring(0, 19);
}

export function toTimespanString(
	seconds: number | undefined,
	showHours = false
): string {
	if (seconds === undefined) {
		// LINT: `!seconds` catches `seconds=0`...
		return showHours ? "??:??:??" : "??:??";
	}
	return new Date(seconds * 1000)
		.toISOString()
		.slice(seconds > 3600 || showHours ? 11 : 14, 19);
}
