import { DocumentData } from "firebase/firestore";
import GenericFirestoreConverter from "../../utils/GenericFirestoreConverter";
import UserModel from "../User.model";

export default interface UserDocument extends DocumentData {
	name: string;
	color?: string;
}

export const UserDocumentConverter = new GenericFirestoreConverter<
	UserModel,
	UserDocument
>();
