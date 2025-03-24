import {
	DocumentData,
	QueryDocumentSnapshot,
	SnapshotOptions,
	Timestamp,
} from "firebase/firestore";

export const DEFAULT_SNAPSHOT_OPTIONS: SnapshotOptions = { serverTimestamps: "estimate" };

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
		console.log("toFirestore", data);
		return data as DbModelType;
	}

	fromFirestore(
		snapshot: QueryDocumentSnapshot,
		options: SnapshotOptions
	): AppModelType {
		const data = snapshot.data(options);
		
		// Convert Timestamp fields to Date objects
		const convertedData = this.convertTimestampsToDate(data);
		
		console.log("fromFirestore", convertedData);
		return convertedData as AppModelType;
	}
	
	/**
	 * Recursively converts all Timestamp instances to Date objects
	 */
	private convertTimestampsToDate(obj: any): any {
		if (obj === null || obj === undefined) {
			return obj;
		}
		
		if (obj instanceof Timestamp) {
			return obj.toDate();
		}
		
		if (Array.isArray(obj)) {
			return obj.map(item => this.convertTimestampsToDate(item));
		}
		
		if (typeof obj === 'object') {
			const result: Record<string, any> = {};
			
			for (const [key, value] of Object.entries(obj)) {
				result[key] = this.convertTimestampsToDate(value);
			}
			
			return result;
		}
		
		return obj;
	}
}