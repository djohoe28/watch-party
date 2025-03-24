import MessageDocument from "../models/Firestore/MessageDocument.model";
import { TimestampConverter } from "../models/Firestore/Timestamp.model";

export const MessageItem = ({ message, userId, userName }: { message: MessageDocument, userId?: string | null, userName?: string | null }) => {
	const timestampDisplayString = TimestampConverter.toDisplayString(message.sentAt ?? Date.now()); // NOTE: Default to current time if sentAt is null (waiting for serverTimestamp).
	// TODO: if message.senderId == userId
	// TODO: Refactor userId prop to isSelf boolean prop?
	return <div className={message.senderId === userId ? "sender-self" : "sender-other"}>{message.content} ({userName ?? message.senderId} @ {timestampDisplayString})</div>;
};
