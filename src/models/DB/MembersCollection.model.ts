import { MemberModel } from "@models/App/Member.model";
import { MemberDocument } from "@models/DB/MemberDocument.model";
import { CollectionReference } from "firebase/firestore";

// export type MembersCollection = Record<string, MemberDocument>; // LINT: Unused?

export type MembersCollectionReference = CollectionReference<
	MemberModel,
	MemberDocument
>;
