import { MemberModel } from "@models/App/Member.model";
import { WithFieldValueWithoutMetadata } from "@mytypes/WithFieldValueWithoutMetadata";
import { DocumentReference } from "firebase/firestore";

export type MemberDocument = WithFieldValueWithoutMetadata<MemberModel>;

export type MemberDocumentReference = DocumentReference<
	MemberModel,
	MemberDocument
>;
