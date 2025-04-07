import { CollectionReference } from "firebase/firestore";
import MemberModel from "../Member.model";
import MemberDocument from "./MemberDocument.model";

export default interface MembersCollection {
	[id: string]: MemberDocument;
}

export type MembersCollectionReference = CollectionReference<MemberModel, MemberDocument>;