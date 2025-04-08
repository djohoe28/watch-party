import { Timestamp } from "firebase/firestore";
import type MediaState from "./MediaState.model";

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
