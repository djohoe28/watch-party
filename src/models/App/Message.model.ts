import { Timestamp } from "firebase/firestore";

export interface MessageModel {
	id?: string;

	content: string;
	senderId: string;
	sentAt: Timestamp | null;
}
