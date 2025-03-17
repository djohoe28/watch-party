import { Typography, Skeleton } from "@mui/material";
import { MessageField } from "./MessageField";
import { MessageList } from "./MessageList";
import { useRoomDocument } from "../hooks/useRoomDocument";
import { RoomIdContext } from "../contexts/RoomIdContext";
import { RoomContextProvider } from "../contexts/RoomContext";
import { useContext } from "react";
import { UserIdContext } from "../contexts/UserIdContext";

export const Room = ({ roomId }: { roomId: string }) => {
	const roomDocument = useRoomDocument(roomId); // TODO: Use Context?
	const userId = useContext(UserIdContext); // TODO: Use User instead of UserID?
	return <RoomIdContext.Provider value={roomId}>
		<RoomContextProvider roomId={roomId}>
			<Typography variant="h5" component="h2" sx={{ mb: 2 }}>
				{roomDocument.loading ? <Skeleton /> : roomDocument.error ? roomDocument.error.toString() : roomDocument.data?.title}
				{userId && ` (${userId})`}
			</Typography>
			<MessageList />
			<MessageField />
		</RoomContextProvider>
	</RoomIdContext.Provider>
};