import type { ChatPacket, MediaPacket } from "./Packet.model";
import type UserModel from "./User.model";

export default interface Room {
	id: string;
	title: string;
	users: Record<string, UserModel>; // userId => User
	chatPackets: ChatPacket[]; // Record mapped with Timestamp?
	latestMediaPacket: MediaPacket;
}
