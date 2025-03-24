// Extracted in case of future changes
type Timestamp = {
	seconds: number;
	nanoseconds: number;
};

function toFirestore(timestamp: Date): Timestamp;
function toFirestore(timestamp: number): Timestamp;
function toFirestore(timestamp: number | Date): Timestamp {
	return {
		seconds: Math.floor(
			timestamp instanceof Date ? timestamp.getTime() / 1000 : timestamp
		),
		nanoseconds:
			(timestamp instanceof Date ? timestamp.getTime() % 1000 : 0) *
			1000000,
	};
}

function fromFirestore(timestamp: Timestamp): Date {
	return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
}


function toDisplayString(timestamp: Timestamp): string;
function toDisplayString(timestamp: Date): string;
function toDisplayString(timestamp: number): string;
function toDisplayString(timestamp: number | Date | Timestamp): string {
	let date: Date;
	if(timestamp instanceof Date) {
		date = timestamp;
	} else if (typeof timestamp === "number") {
		date = new Date(timestamp);
	} else {
		date = fromFirestore(timestamp);
	}
	return date.toISOString().replace("T"," ").substring(0, 19);
}

const TimestampConverter = {
	toFirestore,
	fromFirestore,
	toDisplayString,
};

export default Timestamp;
export { TimestampConverter };
