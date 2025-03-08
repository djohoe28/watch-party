import UserDocument from "./UserDocument.model";

export default interface UsersCollection {
	[id: string]: UserDocument;
}
