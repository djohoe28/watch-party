import MessageDocument from "../models/Firestore/MessageDocument.model";

export const MessageItem = ({ message }: { message: MessageDocument }) => {
	// TODO: if message.senderId == userId
	return <div>{message.content}</div>;
};
