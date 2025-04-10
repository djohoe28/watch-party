import { useParams } from "react-router";
import { Room } from "@components/Room/Room";

export function RoomWrapper() {
	// Hooks
	let params = useParams();

	return <Room roomId={params.roomId!} />; // TODO: Validate params.roomId
}