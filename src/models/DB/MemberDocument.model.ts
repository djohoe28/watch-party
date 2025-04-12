import { MemberModel } from "@models/App/Member.model";
import { WithFieldValueWithoutId } from "@mytypes/WithFieldValueWithoutId";
import { DocumentReference } from "firebase/firestore";

export type MemberDocument = WithFieldValueWithoutId<MemberModel>;

export type MemberDocumentReference = DocumentReference<
	MemberModel,
	MemberDocument
>;
