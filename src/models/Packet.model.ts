import type MediaState from "./MediaState.model";

export default interface Packet {
	senderId: string;
	timestamp: number;
}

export interface MediaPacket extends Packet {
	state: MediaState;
}

export interface ChatPacket extends Packet {
	text: string;
}
