import { Stack } from "@mui/material";
import { MediaPlayer } from "./MediaPlayer";
import { RoomDocumentReferenceContextProvider } from "../contexts/RoomDocumentReferenceContext";
import { RoomIdContext } from "../contexts/RoomIdContext";
import { RoomTitle } from "./RoomTitle";
import { UsersArea } from "./UsersArea";

export const Room = ({ roomId }: { roomId: string }) => {
	return <RoomIdContext.Provider value={roomId}>
		<RoomDocumentReferenceContextProvider roomId={roomId}>
			<RoomTitle />
			<Stack direction="row" spacing={2}>
				<MediaPlayer />
				<UsersArea />
			</Stack>
		</RoomDocumentReferenceContextProvider>
	</RoomIdContext.Provider>
};