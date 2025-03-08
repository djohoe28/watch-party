import RoomDocument from "./RoomDocument.model";

export default interface RoomsCollection {
	[id: string]: RoomDocument;
}
