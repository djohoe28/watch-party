import { CollectionReference, Query } from "firebase/firestore";
import { MessageDocument } from "./MessageDocument.model";

export type MessagesCollection = Record<string, MessageDocument>;

export type MessagesCollectionReference = CollectionReference<
	MessageDocument,
	MessageDocument
>; // TODO: Change to MessageModel.
export type MessagesQueryReference = Query<MessageDocument, MessageDocument>; // NOTE: Query instead of Collection to add sorting.
