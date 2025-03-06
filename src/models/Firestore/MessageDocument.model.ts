import Timestamp from "./Timestamp.model";

export default interface MessageDocument {
	content: string;
	senderId: string;
	sentAt: Timestamp;
}
