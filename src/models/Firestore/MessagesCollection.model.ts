import MessageDocument from "./MessageDocument.model";

export default interface MessagesCollection {
	[id: string]: MessageDocument;
}
