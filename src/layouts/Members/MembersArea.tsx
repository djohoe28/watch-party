import { RoomReferencesContext } from "@contexts/RoomReferencesContext";
import { MessageList } from "@layouts/Messages/Read/MessageList";
import { MessageField } from "@layouts/Messages/Write/MessageField";
import { MembersProvider } from "@layouts/Providers/MembersProvider";
import { Stack } from "@mui/material";
import { useContext, useMemo } from "react";
import { MemberControls } from "./MemberControls";


export function MembersArea() {
	// Contexts
	const roomRefsContext = useContext(RoomReferencesContext);
	// Memos (Derived Contexts)
	const membersRef = useMemo(() => roomRefsContext?.members, [roomRefsContext?.members]);

	return <Stack direction="column" spacing={2}>
		<MembersProvider membersRef={membersRef}>
			<MemberControls />
			<MessageList />
		</MembersProvider>
		<MessageField />
	</Stack>
}