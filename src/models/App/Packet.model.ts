import { MediaState } from "@models/App/MediaState.model";
import { Timestamp } from "firebase/firestore";

export interface Packet {
	senderId: string;
	sentAt: Timestamp;
}

export interface MediaPacket extends Packet {
	state: MediaState;
}

export interface ChatPacket extends Packet {
	content: string;
}
