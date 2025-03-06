import RoomDocument from "./RoomDocument.model";

export default interface RoomsCollection {
	[key: string]: RoomDocument;
}
