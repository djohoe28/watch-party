import MediaState from "./MediaState.model";
import MessagesSubcollection from "./MessagesSubcollection.model";
import Timestamp from "./Timestamp.model";
import UsersSubcollection from "./UsersSubcollection.model";

export default interface RoomDocument {
	// Subcollections
	messages: MessagesSubcollection;
	users: UsersSubcollection;
	// Fields
	createdAt: Timestamp;
	title: string;
	media: MediaState;
}
