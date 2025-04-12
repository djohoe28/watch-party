import { MessageModel } from "@models/App/Message.model";
import { MessageDocument } from "@models/DB/MessageDocument.model";
import {
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
} from "firebase/firestore";

export const messageConverter: FirestoreDataConverter<
	MessageModel,
	MessageDocument
> = {
	toFirestore(model: MessageModel): MessageDocument {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...data } = model;
		return data;
	},
	fromFirestore(
		snapshot: QueryDocumentSnapshot<MessageModel>, // HACK: This assumes model maps 1:1 with document.
		options: SnapshotOptions
	): MessageModel {
		const data = snapshot.data(options);
		return {
			id: snapshot.id,
			...data,
		};
	},
};
