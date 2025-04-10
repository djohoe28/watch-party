import { MediaPlayer } from "@components/Media/Read/MediaPlayer";
import { MembersArea } from "@components/Members/Read/MembersArea";
import { RoomReferencesProvider } from "@components/Providers/RoomReferencesProvider";
import { AuthContext } from "@contexts/AuthContext";
import { Stack } from "@mui/material";
import { useContext, useMemo } from "react";
import { RoomTitle } from "@components/Room/Read/RoomTitle";

export function Room({ roomId }: { roomId: string }) {
	// Contexts
	const authContext = useContext(AuthContext);
	// Memos (Derived Contexts)
	const memberId = useMemo(() => authContext?.payload?.uid, [authContext?.payload?.uid]);

	return <RoomReferencesProvider roomId={roomId} memberId={memberId}>
		<RoomTitle />
		<Stack direction="row" spacing={2}>
			<MediaPlayer />
			<MembersArea />
		</Stack>
	</RoomReferencesProvider>
};