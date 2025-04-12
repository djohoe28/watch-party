import { MemberModel } from "@models/App/Member.model";
import { MemberDocument } from "@models/DB/MemberDocument.model";
import { CollectionReference } from "firebase/firestore";

export type MembersCollection = Record<string, MemberDocument>;

export type MembersCollectionReference = CollectionReference<
	MemberModel,
	MemberDocument
>;
