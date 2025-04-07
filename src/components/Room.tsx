import { Stack } from "@mui/material";
import { MediaPlayer } from "./MediaPlayer";
import { RoomTitle } from "./RoomTitle";
import { UsersArea } from "./UsersArea";
import { RoomReferencesContextProvider } from "../contexts/RoomReferencesContext";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

export const Room = ({ roomId }: { roomId: string }) => {
	const userId = useContext(AuthContext).payload?.uid;
	
	return <RoomReferencesContextProvider roomId={roomId} userId={userId}>
		<RoomTitle />
		<Stack direction="row" spacing={2}>
			<MediaPlayer />
			<UsersArea />
		</Stack>
	</RoomReferencesContextProvider>
};