import { DocumentData } from "firebase/firestore";
import Timestamp from "./Timestamp.model";
import GenericFirestoreConverter from "../../utils/GenericFirestoreConverter";

export default interface MessageDocument extends DocumentData {
	content: string;
	senderId: string;
	sentAt: Timestamp;
}

export const MessageDocumentConverter = new GenericFirestoreConverter<
	MessageDocument, // TODO: Change this to Message
	MessageDocument
>();
