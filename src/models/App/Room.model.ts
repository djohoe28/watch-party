import { MemberModel } from "@models/App/Member.model";
import { ChatPacket, MediaPacket } from "@models/App/Packet.model";

export interface Room {
	id: string;
	title: string;
	members: Record<string, MemberModel>;
	chatPackets: ChatPacket[]; // Record mapped with Timestamp?
	latestMediaPacket: MediaPacket;
}
