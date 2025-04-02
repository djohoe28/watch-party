import { CollectionReference } from "firebase/firestore";
import UserModel from "../User.model";
import UserDocument from "./UserDocument.model";

export default interface UsersCollection {
	[id: string]: UserDocument;
}

export type UsersCollectionReference = CollectionReference<UserModel, UserDocument>;