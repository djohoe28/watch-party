import type { ChatPacket, MediaPacket } from "./Packet.model";
import type User from "./User.model";

export default interface Room {
	id: string;
	title: string;
	users: Record<string, User>; // userId => User
	chatPackets: ChatPacket[]; // Record mapped with Timestamp?
	latestMediaPacket: MediaPacket;
}
