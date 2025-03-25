import { Typography, Skeleton, Stack, Drawer } from "@mui/material";
import { MessageField } from "./MessageField";
import { MessageList } from "./MessageList";
import { useRoomDocument } from "../hooks/useRoomDocument";
import { RoomContextProvider } from "../contexts/RoomContext";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { UsersContextProvider } from "../contexts/UsersContext";
import { UsersDrawer } from "./UsersDrawer";

export const Room = ({ roomId }: { roomId: string }) => {
	const roomDocument = useRoomDocument(roomId); // TODO: Use Context?
	const userContext = useContext(UserContext); // TODO: Use User instead of UserID?
	// return <RoomIdContext.Provider value={roomId}>{...}</RoomIdContext.Provider>
	return <RoomContextProvider roomId={roomId}>
		<Typography variant="h5" component="h2" sx={{ mb: 2 }}>
			{roomDocument.loading ? <Skeleton /> : roomDocument.error ? roomDocument.error.toString() : roomDocument.data?.title}
			{userContext.payload && ` (${userContext.payload?.uid})`}
		</Typography>
		<Stack direction="row" spacing={2}>
			<Stack direction="column" spacing={2}>
				<UsersContextProvider roomRef={roomDocument.payload}>
					<UsersDrawer />
					<MessageList />
				</UsersContextProvider>
				<MessageField />
			</Stack>
		</Stack>
	</RoomContextProvider>
};