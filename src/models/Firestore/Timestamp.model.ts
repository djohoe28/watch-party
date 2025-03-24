import { Timestamp } from "firebase/firestore";

function toFirestore(timestamp: Date): Timestamp;
function toFirestore(timestamp: number): Timestamp;
function toFirestore(timestamp: number | Date): Timestamp {
	return Timestamp.fromDate(timestamp instanceof Date ? timestamp : new Date(timestamp));
}

function fromFirestore(timestamp: Timestamp): Date {
	return timestamp.toDate();
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
		date = timestamp.toDate();
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
