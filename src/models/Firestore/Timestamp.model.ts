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

const TimestampConverter = {
	toFirestore,
	fromFirestore,
};

export default Timestamp;
export { TimestampConverter };
