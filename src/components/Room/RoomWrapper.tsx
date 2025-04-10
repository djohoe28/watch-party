import { useParams } from "react-router";
import { Room } from "./Room";

export function RoomWrapper() {
	// Hooks
	const params = useParams();

	return <Room roomId={params.roomId!} />; // TODO LINTODO: Validate params.roomId
}