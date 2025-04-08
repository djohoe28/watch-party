import { Stack } from "@mui/material";
import { MediaPlayer } from "../MediaPlayer";
import { MembersArea } from "../Members/Read/MembersArea";
import { RoomReferencesContextProvider } from "../../contexts/RoomReferencesContext";
import { useContext, useMemo } from "react";
import AuthContext from "../../contexts/AuthContext";
import { RoomTitle } from "./RoomTitle";

export function Room({ roomId }: { roomId: string }) {
	// Contexts
	const authContext = useContext(AuthContext);
	// Memos (Derived Contexts)
	const memberId = useMemo(() => authContext?.payload?.uid, [authContext?.payload?.uid]);

	return <RoomReferencesContextProvider roomId={roomId} memberId={memberId}>
		<RoomTitle />
		<Stack direction="row" spacing={2}>
			<MediaPlayer />
			<MembersArea />
		</Stack>
	</RoomReferencesContextProvider>
};