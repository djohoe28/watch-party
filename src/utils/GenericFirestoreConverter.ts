import {
	DocumentData,
	FirestoreDataConverter,
	QueryDocumentSnapshot,
	SnapshotOptions,
} from "firebase/firestore";

export const DEFAULT_SNAPSHOT_OPTIONS: SnapshotOptions = {
	serverTimestamps: "estimate",
};

/**
 * Generic converter to & from Firestore.
 *
 * @template AppModelType Model as it appears in code.
 * @template DbModelType Model as it appears in Firestore.
 * @returns Typed Firestore converter.
 */
export default class GenericFirestoreConverter<
	AppModelType,
	DbModelType extends DocumentData
> implements FirestoreDataConverter<AppModelType, DbModelType>
{
	toFirestore(data: AppModelType): DbModelType {
		// TODO: Convert Timestamp? Is this currently used?
		// TODO: Hard Casting Conversion! Fix this!
		if (data instanceof Object && Object.hasOwn(data, "id")) {
			const { id, ...rest } = data as any;
			return rest as unknown as DbModelType;
		}
		return data as unknown as DbModelType;
	}

	fromFirestore(
		snapshot: QueryDocumentSnapshot,
		options: SnapshotOptions
	): AppModelType {
		const data = snapshot.data(options);
		// TODO: Performance hit could be circumvented with specific converters.
		return { id: snapshot.id, ...data } as AppModelType;
	}
}
