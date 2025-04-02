import { Stack, Grid } from "@mui/material";
import { MessageField } from "./MessageField";
import { MessageList } from "./MessageList";
import { UsersContextProvider } from "../contexts/UsersContext";
import { UsersDrawer } from "./UsersDrawer";
import { UserDrawer } from "./UserDrawer";
import { VideoPlayerReact } from "./VideoPlayerReact";
import { RoomDocumentReferenceContextProvider } from "../contexts/RoomDocumentReferenceContext";
import { RoomIdContext } from "../contexts/RoomIdContext";
import { useRoomDocumentReference } from "../hooks/useRoomDocumentReference";
import { RoomTitle } from "./RoomTitle";

export const Room = ({ roomId }: { roomId: string }) => {
	// Hooks
	const roomDocument = useRoomDocumentReference(roomId); // TODO: Use Context?
	return <RoomIdContext.Provider value={roomId}>
		<RoomDocumentReferenceContextProvider roomId={roomId}>
			<RoomTitle />
			<Stack direction="row" spacing={2}>
				<VideoPlayerReact />
				<Stack direction="column" spacing={2}>
					<UsersContextProvider roomRef={roomDocument}>
						<Grid container spacing={2} textAlign='center'>
							<Grid size='grow'>
								<UserDrawer />
							</Grid>
							<Grid size='grow'>
								<UsersDrawer />
							</Grid>
						</Grid>
						<MessageList />
					</UsersContextProvider>
					<MessageField />
				</Stack>
			</Stack>
		</RoomDocumentReferenceContextProvider>
	</RoomIdContext.Provider>
};