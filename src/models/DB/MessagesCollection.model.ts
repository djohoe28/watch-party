import { MessageModel } from "@models/App/Message.model";
import { MessageDocument } from "@models/DB/MessageDocument.model";
import { CollectionReference, Query } from "firebase/firestore";

// export type MessagesCollection = Record<string, MessageDocument>; // LINT: Unused?

export type MessagesCollectionReference = CollectionReference<
	MessageModel,
	MessageDocument
>;
export type MessagesQueryReference = Query<MessageModel, MessageDocument>;
