import { Timestamp } from "firebase/firestore";

function toFirestore(timestamp: Date): Timestamp;
function toFirestore(timestamp: number): Timestamp;
function toFirestore(timestamp: number | Date): Timestamp {
	return Timestamp.fromDate(timestamp instanceof Date ? timestamp : new Date(timestamp));
}

function fromFirestore(timestamp: Timestamp): Date {
	return timestamp.toDate();
}

const TimestampConverter = {
	toFirestore,
	fromFirestore,
};

export default Timestamp;
export { TimestampConverter };
