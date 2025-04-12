import { MediaPlayer } from "@components/Media/Read/MediaPlayer";
import { MembersArea } from "@components/Members/MembersArea";
import { RoomReferencesProvider } from "@components/Providers/RoomReferencesProvider";
import { RoomTitle } from "@components/Room/Read/RoomTitle";
import { AuthUserContext } from "@contexts/AuthContext";
import { Stack } from "@mui/material";
import { useContext, useMemo } from "react";

export function Room({ roomId }: { roomId: string }) {
	// Contexts
	const authContext = useContext(AuthUserContext);
	// Memos (Derived Contexts)
	const memberId = useMemo(() => authContext?.uid, [authContext?.uid]);

	return <RoomReferencesProvider roomId={roomId} memberId={memberId}>
		<RoomTitle />
		<Stack direction="row" spacing={2}>
			<MediaPlayer />
			<MembersArea />
		</Stack>
	</RoomReferencesProvider>
};