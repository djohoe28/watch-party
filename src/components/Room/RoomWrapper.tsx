import { useParams } from "react-router";
import { Room } from "./Room";

export function RoomWrapper() {
	let params = useParams();
	return <Room roomId={params.roomId!} />; // TODO: Validate params.roomId
}