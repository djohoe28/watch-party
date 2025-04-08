import { MemberModel } from "./Member.model";
import { ChatPacket, MediaPacket } from "./Packet.model";

export interface Room {
	id: string;
	title: string;
	members: Record<string, MemberModel>;
	chatPackets: ChatPacket[]; // Record mapped with Timestamp?
	latestMediaPacket: MediaPacket;
}
