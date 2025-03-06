import UserDocument from "./UserDocument.model";

export default interface UsersSubcollection {
	[key: string]: UserDocument;
}
