import { RoomModel } from "@models/App/Room.model";
import { RoomDocument } from "@models/DB/RoomDocument.model";
import {
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
} from "firebase/firestore";

export const roomConverter: FirestoreDataConverter<RoomModel, RoomDocument> = {
	toFirestore(model: RoomModel): RoomDocument {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...data } = model;
		return data;
	},
	fromFirestore(
		snapshot: QueryDocumentSnapshot<RoomModel>, // HACK: This assumes model maps 1:1 with document.
		options: SnapshotOptions
	): RoomModel {
		const data = snapshot.data(options);
		return {
			id: snapshot.id,
			...data,
		};
	},
};
