import { MemberModel } from "@models/App/Member.model";
import { MemberDocument } from "@models/DB/MemberDocument.model";
import {
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
} from "firebase/firestore";

export const memberConverter: FirestoreDataConverter<
	MemberModel,
	MemberDocument
> = {
	toFirestore(model: MemberModel): MemberDocument {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, ...data } = model;
		return data;
	},
	fromFirestore(
		snapshot: QueryDocumentSnapshot<MemberModel>, // HACK: This assumes model maps 1:1 with document.
		options: SnapshotOptions
	): MemberModel {
		const data = snapshot.data(options);
		return {
			id: snapshot.id,
			...data,
		};
	},
};
