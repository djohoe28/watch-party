import { Typography, Skeleton, Stack, Drawer } from "@mui/material";
import { MessageField } from "./MessageField";
import { MessageList } from "./MessageList";
import { useRoomDocument } from "../hooks/useRoomDocument";
import { RoomContextProvider } from "../contexts/RoomContext";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { UsersContextProvider } from "../contexts/UsersContext";
import { UsersDrawer } from "./UsersDrawer";
import UserSettings from "./UserSettings";

export const Room = ({ roomId }: { roomId: string }) => {
	// Contexts
	const authContext = useContext(AuthContext); // TODO: Use User instead of UserID?
	// Hooks
	const roomDocument = useRoomDocument(roomId); // TODO: Use Context?
	// return <RoomIdContext.Provider value={roomId}>{...}</RoomIdContext.Provider>
	return <RoomContextProvider roomId={roomId}>
		<Typography variant="h5" component="h2" sx={{ mb: 2 }}>
			{roomDocument.loading ? <Skeleton /> : roomDocument.error ? roomDocument.error.toString() : roomDocument.data?.title}
			{authContext.payload && ` (${authContext.payload?.uid})`}
		</Typography>
		<Stack direction="row" spacing={2}>
			<Stack direction="column" spacing={2}>
				{roomDocument.payload
					? <UsersContextProvider roomRef={roomDocument.payload}>
						<UserSettings />
						<UsersDrawer />
						<MessageList />
					</UsersContextProvider>
					: null}
				<MessageField />
			</Stack>
		</Stack>
	</RoomContextProvider>
};