import { ErrorDisplay } from "@components/ErrorDisplay";
import { Room } from "@components/Room/Room";
import { useParams } from "react-router";

export function RoomWrapper() {
	// Hooks
	const params = useParams();

	if (!params.roomId) return <ErrorDisplay error={new Error("Room ID not found")} />;
	return <Room roomId={params.roomId} />;
}