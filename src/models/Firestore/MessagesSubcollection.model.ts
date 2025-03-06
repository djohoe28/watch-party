import MessageDocument from "./MessageDocument.model";

export default interface MessagesSubcollection {
	[key: string]: MessageDocument;
}
