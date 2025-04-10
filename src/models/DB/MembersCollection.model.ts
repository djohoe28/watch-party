import { CollectionReference } from "firebase/firestore";
import { MemberDocument } from "./MemberDocument.model";
import { MemberModel } from "@models/App/Member.model";

export type MembersCollection = Record<string, MemberDocument>;

export type MembersCollectionReference = CollectionReference<MemberModel, MemberDocument>;