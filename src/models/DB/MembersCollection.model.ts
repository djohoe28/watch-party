import { CollectionReference } from "firebase/firestore";
import { MemberDocument } from "@models/DB/MemberDocument.model";
import { MemberModel } from "@models/App/Member.model";

export interface MembersCollection {
	[id: string]: MemberDocument;
}

export type MembersCollectionReference = CollectionReference<MemberModel, MemberDocument>;