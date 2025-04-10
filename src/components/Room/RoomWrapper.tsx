import { Room } from "@components/Room/Room";
import { useParams } from "react-router";

export function RoomWrapper() {
	// Hooks
	let params = useParams();

	return <Room roomId={params.roomId!} />; // TODO: Validate params.roomId
}