import { RoomDocument } from "@models/DB/RoomDocument.model";

export interface RoomsCollection {
	[id: string]: RoomDocument;
}
