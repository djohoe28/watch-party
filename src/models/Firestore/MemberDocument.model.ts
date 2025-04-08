import { DocumentData, DocumentReference } from "firebase/firestore";
import GenericFirestoreConverter from "../../utils/GenericFirestoreConverter";
import MemberModel from "../Member.model";

export interface MemberDocument extends DocumentData {
	name?: string;
	color?: string;
}

export const MemberDocumentConverter = new GenericFirestoreConverter<
	MemberModel,
	MemberDocument
>();

export type MemberDocumentReference = DocumentReference<MemberModel, MemberDocument>;