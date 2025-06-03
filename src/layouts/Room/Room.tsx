import { AuthUserContext } from "@contexts/AuthContext";
import { MediaPlayer } from "@layouts/Media/Read/MediaPlayer";
import { MembersArea } from "@layouts/Members/MembersArea";
import { RoomDataProvider } from "@layouts/Providers/RoomDataProvider";
import { RoomReferencesProvider } from "@layouts/Providers/RoomReferencesProvider";
import { Stack } from "@mui/material";
import { useContext, useMemo } from "react";
import { RoomTitle } from "./Read/RoomTitle";

export function Room({ roomId }: { roomId: string }) {
	// Contexts
	const authContext = useContext(AuthUserContext);
	// Memos (Derived Contexts)
	const memberId = useMemo(() => authContext?.uid, [authContext?.uid]);

	return <RoomReferencesProvider roomId={roomId} memberId={memberId}>
		<RoomDataProvider>
			<RoomTitle />
			<Stack direction="row" spacing={2}>
				<MediaPlayer />
				<MembersArea />
			</Stack>
		</RoomDataProvider>
	</RoomReferencesProvider>
};