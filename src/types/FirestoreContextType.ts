import type {
	CollectionReference,
	DocumentData,
	DocumentReference,
	Query,
} from "firebase/firestore";

export interface FirestoreContextType {
	ref: Query | CollectionReference | DocumentReference;
	loading: boolean;
	error: string | Error | null;
}

export interface FirestoreQueryContextType<
	AppModelType extends DocumentData,
	DbModelType extends DocumentData
> extends FirestoreContextType {
	ref: Query<AppModelType, DbModelType>;
	data: AppModelType[] | null;
}

export interface FirestoreCollectionContextType<
	AppModelType extends DocumentData,
	DbModelType extends DocumentData
> extends FirestoreContextType {
	ref: CollectionReference<AppModelType, DbModelType>;
	data: AppModelType[] | null;
}

export interface FirestoreDocumentContextType<
	AppModelType extends DocumentData,
	DbModelType extends DocumentData
> extends FirestoreContextType {
	ref: DocumentReference<AppModelType, DbModelType>;
	data: AppModelType | null;
}
