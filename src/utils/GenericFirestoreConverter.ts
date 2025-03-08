import {
	DocumentData,
	QueryDocumentSnapshot,
	SnapshotOptions,
} from "firebase/firestore";

/**
 * Generic converter to & from Firestore.
 *
 * @template AppModelType Model as it appears in code.
 * @template DbModelType Model as it appears in Firestore.
 * @returns Typed Firestore converter.
 */
export default class GenericFirestoreConverter<
	AppModelType extends DbModelType,
	DbModelType extends DocumentData
> {
	toFirestore(data: AppModelType): DbModelType {
		return data as DbModelType;
	}

	fromFirestore(
		snapshot: QueryDocumentSnapshot,
		options: SnapshotOptions
	): AppModelType {
		// TODO: id: snapshot.id
		return snapshot.data(options)! as AppModelType;
	}
}
