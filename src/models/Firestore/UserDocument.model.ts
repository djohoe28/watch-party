import { DocumentData } from "firebase/firestore";
import GenericFirestoreConverter from "../../utils/GenericFirestoreConverter";
import User from "../User.model";

export default interface UserDocument extends DocumentData {
	name: string;
}

export const UserDocumentConverter = new GenericFirestoreConverter<
	User,
	UserDocument
>();
