import MessageDocument from "../models/Firestore/MessageDocument.model";

export const MessageItem = ({ message, userId }: { message: MessageDocument, userId?: string }) => {
	// TODO: if message.senderId == userId
	return <div className={message.senderId === userId ? "sender-self" : "sender-other"}>{message.content}</div>;
};
