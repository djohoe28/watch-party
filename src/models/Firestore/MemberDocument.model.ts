import { MemberModel } from "@models/Member.model";
import { GenericFirestoreConverter } from "@utils/GenericFirestoreConverter";
import { DocumentData, DocumentReference } from "firebase/firestore";

export interface MemberDocument extends DocumentData {
	name?: string;
	color?: string;
}

export const MemberDocumentConverter = new GenericFirestoreConverter<
	MemberModel,
	MemberDocument
>();

export type MemberDocumentReference = DocumentReference<MemberModel, MemberDocument>;