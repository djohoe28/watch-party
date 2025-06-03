import { ErrorDisplay } from "@layouts/components/ErrorDisplay";
import { useParams } from "react-router";
import { Room } from "./Room";

export function RoomWrapper() {
	// Hooks
	const params = useParams();

	if (!params.roomId) return <ErrorDisplay error={new Error("Room ID not found")} />;
	return <Room roomId={params.roomId} />;
}