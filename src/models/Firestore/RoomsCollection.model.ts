import { RoomDocument } from "./RoomDocument.model";

export interface RoomsCollection {
	[id: string]: RoomDocument;
}
