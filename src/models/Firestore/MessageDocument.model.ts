import { DocumentData, Timestamp } from "firebase/firestore";
import GenericFirestoreConverter from "../../utils/GenericFirestoreConverter";

export interface MessageDocument extends DocumentData {
	content: string;
	senderId: string;
	sentAt: Timestamp;
}

export const MessageDocumentConverter = new GenericFirestoreConverter<
	MessageDocument, // TODO: Change this to MessageModel.
	MessageDocument
>();
