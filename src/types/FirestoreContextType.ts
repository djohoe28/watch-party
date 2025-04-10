import type {
	CollectionReference,
	DocumentData,
	DocumentReference,
	Query,
} from "firebase/firestore";
import { AsyncContext } from "../types/AsyncContext"; // TODO: @types ?

interface FirestoreContextType
	extends AsyncContext<Query | CollectionReference | DocumentReference> {
	/** Reference to the desired Query / Collection / Document. */
	payload: Query | CollectionReference | DocumentReference | null;
	/** The data last received via Snapshot. Optional. */
	data?: any | null;
}

export interface FirestoreQueryContextType<
	AppModelType extends DocumentData,
	DbModelType extends DocumentData
> extends FirestoreContextType {
	payload: Query<AppModelType, DbModelType> | null;
	data?: AppModelType[] | null;
}

export interface FirestoreCollectionContextType<
	AppModelType extends DocumentData,
	DbModelType extends DocumentData
> extends FirestoreContextType {
	payload: CollectionReference<AppModelType, DbModelType> | null;
	data?: AppModelType[] | null;
}

export interface FirestoreDocumentContextType<
	AppModelType extends DocumentData,
	DbModelType extends DocumentData
> extends FirestoreContextType {
	payload: DocumentReference<AppModelType, DbModelType> | null;
	data?: AppModelType | null;
	setData?: (data: AppModelType | null) => void;
}
