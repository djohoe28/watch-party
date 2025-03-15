import { Typography, Skeleton } from "@mui/material";
import { MessageField } from "./MessageField";
import { MessageList } from "./MessageList";
import { useRoomDocument } from "../hooks/useRoomDocument";
import { RoomIdContext } from "../contexts/RoomIdContext";
import { RoomContextProvider } from "../contexts/RoomContext";

export const Room = ({ roomId }: { roomId: string }) => {
	const roomDocument = useRoomDocument(roomId);
	return <RoomIdContext.Provider value={roomId}>
		<RoomContextProvider roomId={roomId}>
			<Typography variant="h5" component="h2" sx={{ mb: 2 }}>
				{roomDocument.loading ? <Skeleton /> : roomDocument.error ? roomDocument.error.toString() : roomDocument.data?.title}
			</Typography>
			<MessageList />
			<MessageField />
		</RoomContextProvider>
	</RoomIdContext.Provider>
};