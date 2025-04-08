import { MemberModel } from "@models/Member.model";
import { CollectionReference } from "firebase/firestore";
import { MemberDocument } from "./MemberDocument.model";

export interface MembersCollection {
	[id: string]: MemberDocument;
}

export type MembersCollectionReference = CollectionReference<MemberModel, MemberDocument>;