import type { ChatPacket, MediaPacket } from "./Packet.model";
import type MemberModel from "./Member.model";

export default interface Room {
	id: string;
	title: string;
	members: Record<string, MemberModel>;
	chatPackets: ChatPacket[]; // Record mapped with Timestamp?
	latestMediaPacket: MediaPacket;
}
